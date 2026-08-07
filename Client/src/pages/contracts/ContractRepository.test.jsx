import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import axios from "axios";
import ContractRepository from "./ContractRepository";

vi.mock("axios");

vi.mock("xlsx", () => ({
  utils: {
    json_to_sheet: vi.fn(() => ({})),
    book_new: vi.fn(() => ({})),
    book_append_sheet: vi.fn(),
  },
  write: vi.fn(() => new ArrayBuffer(8)),
}));

vi.mock("file-saver", () => ({
  saveAs: vi.fn(),
}));

const mockContracts = [
  {
    id: "CON-001",
    title: "Software Services Agreement",
    vendor: "ABC Technologies",
    type: "Service Agreement",
    value: 50000,
    end_date: "2025-01-15",
    owner: "John Doe",
    status: "Active",
    compliance: "95%",
  },
  {
    id: "CON-002",
    title: "Cloud Services Contract",
    vendor: "Amazon Web Services",
    type: "Cloud Services",
    value: 75000,
    end_date: "2025-06-30",
    owner: "Sarah Chen",
    status: "Renewal Due",
    compliance: "82%",
  },
];

describe("ContractRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    axios.get.mockResolvedValue({
      data: mockContracts,
    });

    axios.post.mockResolvedValue({
      data: mockContracts[0],
    });

    axios.put.mockResolvedValue({
      data: mockContracts[0],
    });

    axios.delete.mockResolvedValue({
      data: {},
    });

    window.confirm = vi.fn(() => true);
  });

  // ----------------------------------------------------
  // 1. INITIAL RENDER
  // ----------------------------------------------------

  test("renders Contract Repository heading", async () => {
    render(<ContractRepository />);

    expect(
      screen.getByRole("heading", {
        name: "Contract Repository",
      })
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });

  // ----------------------------------------------------
  // 2. FETCH AND DISPLAY CONTRACTS
  // ----------------------------------------------------

  test("fetches and displays contracts", async () => {
    render(<ContractRepository />);

    expect(
      screen.getByText("Loading live repository entries...")
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("Software Services Agreement")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("ABC Technologies")
    ).toBeInTheDocument();

    expect(
      screen.getByText("John Doe")
    ).toBeInTheDocument();

    expect(
      screen.getByText("95%")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Cloud Services Contract")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Amazon Web Services")
    ).toBeInTheDocument();
  });

  // ----------------------------------------------------
  // 3. SEARCH
  // ----------------------------------------------------

  test("searches contracts", async () => {
    render(<ContractRepository />);

    await waitFor(() => {
      expect(
        screen.getByText("Software Services Agreement")
      ).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      "Search contracts..."
    );

    fireEvent.change(searchInput, {
      target: {
        value: "Software",
      },
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            search: "Software",
          }),
        })
      );
    });
  });

  // ----------------------------------------------------
  // 4. STATUS FILTER
  // ----------------------------------------------------

  test("filters contracts by status", async () => {
    render(<ContractRepository />);

    await waitFor(() => {
      expect(
        screen.getByText("Software Services Agreement")
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Renewal Due",
      })
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            status: "Renewal Due",
          }),
        })
      );
    });
  });

  // ----------------------------------------------------
  // 5. CREATE MODAL
  // ----------------------------------------------------

  test("opens Create New Contract modal", async () => {
    render(<ContractRepository />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ New Contract",
      })
    );

    expect(
      screen.getByText("Create New Contract")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        "e.g. AWS Production Infrastructure"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        "e.g. Amazon Web Services"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        "e.g. $1.20M"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        "e.g. Sarah Chen"
      )
    ).toBeInTheDocument();
  });

  // ----------------------------------------------------
  // 6. ENTER CREATE FORM DATA
  // ----------------------------------------------------

  test("allows entering contract information", async () => {
    render(<ContractRepository />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ New Contract",
      })
    );

    const titleInput = screen.getByPlaceholderText(
      "e.g. AWS Production Infrastructure"
    );

    const vendorInput = screen.getByPlaceholderText(
      "e.g. Amazon Web Services"
    );

    fireEvent.change(titleInput, {
      target: {
        value: "New Software Contract",
      },
    });

    fireEvent.change(vendorInput, {
      target: {
        value: "Test Vendor",
      },
    });

    expect(titleInput).toHaveValue(
      "New Software Contract"
    );

    expect(vendorInput).toHaveValue(
      "Test Vendor"
    );
  });

  // ----------------------------------------------------
  // 7. CANCEL MODAL
  // ----------------------------------------------------

  test("closes create contract modal using Cancel", async () => {
    render(<ContractRepository />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ New Contract",
      })
    );

    expect(
      screen.getByText("Create New Contract")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Cancel",
      })
    );

    expect(
      screen.queryByText("Create New Contract")
    ).not.toBeInTheDocument();
  });

  // ----------------------------------------------------
  // 8. VIEW CONTRACT DETAILS
  // ----------------------------------------------------

  test("opens contract details when contract title is clicked", async () => {
    render(<ContractRepository />);

    await waitFor(() => {
      expect(
        screen.getByText("Software Services Agreement")
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByText("Software Services Agreement")
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: "Software Services Agreement",
        })
      ).toBeInTheDocument();
    });
  });

  // ----------------------------------------------------
  // 9. VIEW BUTTON
  // ----------------------------------------------------

  test("opens contract details using View button", async () => {
    render(<ContractRepository />);

    await waitFor(() => {
      expect(
        screen.getByText("Software Services Agreement")
      ).toBeInTheDocument();
    });

    const viewButtons =
      screen.getAllByTitle("View");

    fireEvent.click(viewButtons[0]);

    expect(
      screen.getByRole("heading", {
        name: "Software Services Agreement",
      })
    ).toBeInTheDocument();
  });

  // ----------------------------------------------------
  // 10. EDIT MODAL
  // ----------------------------------------------------

  test("opens edit modal with existing contract data", async () => {
    render(<ContractRepository />);

    await waitFor(() => {
      expect(
        screen.getByText("Software Services Agreement")
      ).toBeInTheDocument();
    });

    const editButtons =
      screen.getAllByTitle("Edit");

    fireEvent.click(editButtons[0]);

    expect(
      screen.getByText("Modify Contract Details")
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue(
        "Software Services Agreement"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue(
        "ABC Technologies"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue(
        "John Doe"
      )
    ).toBeInTheDocument();
  });

  // ----------------------------------------------------
  // 11. DELETE
  // ----------------------------------------------------

  test("deletes a contract after confirmation", async () => {
    render(<ContractRepository />);

    await waitFor(() => {
      expect(
        screen.getByText("Software Services Agreement")
      ).toBeInTheDocument();
    });

    const deleteButtons =
      screen.getAllByTitle("Delete");

    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(
        window.confirm
      ).toHaveBeenCalledWith(
        "Are you absolutely sure you want to delete contract CON-001?"
      );

      expect(
        axios.delete
      ).toHaveBeenCalledWith(
        expect.stringContaining("CON-001")
      );
    });
  });

  // ----------------------------------------------------
  // 12. EXPORT
  // ----------------------------------------------------

  test("exports contracts to Excel", async () => {
    render(<ContractRepository />);

    await waitFor(() => {
      expect(
        screen.getByText("Software Services Agreement")
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /Export/i,
      })
    );

    const XLSX = await import("xlsx");
    const { saveAs } = await import("file-saver");

    expect(
      XLSX.utils.json_to_sheet
    ).toHaveBeenCalled();

    expect(
      XLSX.utils.book_new
    ).toHaveBeenCalled();

    expect(
      XLSX.utils.book_append_sheet
    ).toHaveBeenCalled();

    expect(
      XLSX.write
    ).toHaveBeenCalled();

    expect(
      saveAs
    ).toHaveBeenCalledWith(
      expect.any(Blob),
      "Contracts.xlsx"
    );
  });

  // ----------------------------------------------------
  // 13. CREATE CONTRACT API
  // ----------------------------------------------------

  test("creates a new contract", async () => {
    render(<ContractRepository />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ New Contract",
      })
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "e.g. AWS Production Infrastructure"
      ),
      {
        target: {
          value: "New Contract",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "e.g. Amazon Web Services"
      ),
      {
        target: {
          value: "New Vendor",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "e.g. $1.20M"
      ),
      {
        target: {
          value: "$100000",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "e.g. Sarah Chen"
      ),
      {
        target: {
          value: "Jane Doe",
        },
      }
    );

    fireEvent.change(
      document.querySelector('input[type="date"]') || screen.getByLabelText(/End Date|Date/i),
      {
        target: {
          value: "2026-12-31",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Create Contract",
      })
    );

    await waitFor(() => {
      expect(
        axios.post
      ).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          title: "New Contract",
          vendor: "New Vendor",
          owner: "Jane Doe",
        })
      );
    });
  });
});