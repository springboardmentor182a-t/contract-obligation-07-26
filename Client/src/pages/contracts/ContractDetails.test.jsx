import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import ContractDetails from "./ContractDetails";

const mockContract = {
  id: "CON-001",
  title: "Software Services Agreement",
  vendor: "ABC Technologies",
  type: "Service Agreement",
  value: "$50,000",
  startDate: "2024-01-15",
  end_date: "2025-01-15",
  owner: "John Doe",
  status: "Active",
  compliance: "95%",
  summary: "This is a software services contract.",
  autoRenewal: "Yes",
  paymentTerms: "Monthly",
  governingLaw: "Indian Law",
  liabilityCap: "$10,000",
};

describe("ContractDetails", () => {
  test("renders contract details correctly", () => {
    render(
      <ContractDetails
        contract={mockContract}
        onBack={vi.fn()}
        onEditClick={vi.fn()}
      />
    );

    expect(
      screen.getByRole("heading", {
        name: "Software Services Agreement",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/ABC Technologies.*Service Agreement/i)
    ).toBeInTheDocument();

    expect(screen.getByText("$50,000")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    expect(screen.getAllByText("95%").length).toBeGreaterThan(0);

    expect(screen.getByText("Contract Summary")).toBeInTheDocument();

    expect(
      screen.getByText("This is a software services contract.")
    ).toBeInTheDocument();
  });

  test("switches between contract detail tabs", () => {
    render(
      <ContractDetails
        contract={mockContract}
        onBack={vi.fn()}
        onEditClick={vi.fn()}
      />
    );

    expect(screen.getByText("Contract Summary")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Obligations" })
    );

    expect(screen.getByText("Active Obligations")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Documents" })
    );

    expect(
      screen.getByText("Associated Attachments")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "History" })
    );

    expect(
      screen.getByText("Audit Log History")
    ).toBeInTheDocument();
  });
});