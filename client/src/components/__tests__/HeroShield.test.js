import React from "react";
import { render } from "@testing-library/react";
import HeroShield from "../HeroShield";

describe("HeroShield", () => {
  test("renders the SVG", () => {
    const { container } = render(<HeroShield />);

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  test("uses default className", () => {
    const { container } = render(<HeroShield />);

    expect(container.querySelector("svg")).toHaveClass("w-full");
    expect(container.querySelector("svg")).toHaveClass("h-full");
  });

  test("applies custom className", () => {
    const { container } = render(
      <HeroShield className="custom-shield" />
    );

    expect(container.querySelector("svg")).toHaveClass("custom-shield");
  });

  test("renders SVG with correct viewBox", () => {
    const { container } = render(<HeroShield />);

    expect(container.querySelector("svg")).toHaveAttribute(
      "viewBox",
      "0 0 400 400"
    );
  });

  test("renders SVG definitions", () => {
    const { container } = render(<HeroShield />);

    expect(container.querySelector("defs")).toBeInTheDocument();
    expect(container.querySelector("#shieldGrad")).toBeInTheDocument();
    expect(container.querySelector("#checkGrad")).toBeInTheDocument();
    expect(container.querySelector("#glow")).toBeInTheDocument();
  });

  test("renders shield document background", () => {
    const { container } = render(<HeroShield />);

    const rect = container.querySelector("rect");

    expect(rect).toBeInTheDocument();
    expect(rect).toHaveAttribute("x", "90");
    expect(rect).toHaveAttribute("y", "60");
    expect(rect).toHaveAttribute("width", "220");
    expect(rect).toHaveAttribute("height", "280");
  });

  test("renders shield and checkmark paths", () => {
    const { container } = render(<HeroShield />);

    const paths = container.querySelectorAll("path");

    expect(paths.length).toBeGreaterThanOrEqual(3);
  });

  test("renders document lines", () => {
    const { container } = render(<HeroShield />);

    const lines = container.querySelectorAll("line");

    expect(lines.length).toBe(3);
  });
});