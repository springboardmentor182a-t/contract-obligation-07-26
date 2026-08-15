import React from "react";
import { render } from "@testing-library/react";
import {
  DashboardIcon,
  ContractsIcon,
  ObligationsIcon,
  ComplianceIcon,
  SettingsIcon,
  ReportsIcon,
  UsersIcon,
} from "../DashboardIcons";

describe("DashboardIcons", () => {
  const icons = [
    ["DashboardIcon", DashboardIcon],
    ["ContractsIcon", ContractsIcon],
    ["ObligationsIcon", ObligationsIcon],
    ["ComplianceIcon", ComplianceIcon],
    ["SettingsIcon", SettingsIcon],
    ["ReportsIcon", ReportsIcon],
    ["UsersIcon", UsersIcon],
  ];

  test.each(icons)("%s renders an SVG", (name, Icon) => {
    const { container } = render(<Icon />);

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  test.each(icons)("%s uses the default className", (name, Icon) => {
    const { container } = render(<Icon />);

    expect(container.querySelector("svg")).toHaveClass(
      "w-6",
      "h-6"
    );
  });

  test.each(icons)("%s accepts a custom className", (name, Icon) => {
    const { container } = render(
      <Icon className="custom-icon" />
    );

    expect(container.querySelector("svg")).toHaveClass(
      "custom-icon"
    );
  });
});
