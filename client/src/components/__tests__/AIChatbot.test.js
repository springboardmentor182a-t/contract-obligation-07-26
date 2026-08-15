import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AIChatbot from "../AIChatbot";

describe("AIChatbot", () => {
  test("renders chatbot button", () => {
    render(<AIChatbot />);
    expect(document.querySelector("button")).toBeInTheDocument();
  });

  test("opens chatbot", () => {
    render(<AIChatbot />);

    fireEvent.click(document.querySelector("button"));

    expect(
      screen.getByText("ContractIQ AI Assistant")
    ).toBeInTheDocument();
  });

  test("shows message input", () => {
    render(<AIChatbot />);

    fireEvent.click(document.querySelector("button"));

    expect(
      screen.getByPlaceholderText("Type a message...")
    ).toBeInTheDocument();
  });
});