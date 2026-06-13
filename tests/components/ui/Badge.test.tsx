import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Badge } from "../../../src/components/ui/Badge";

describe("Badge Component", () => {
  it("renders correctly with default variant", () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText("Default Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-primary-container text-on-primary-container");
  });

  it("applies the success variant class", () => {
    render(<Badge variant="success">Success Badge</Badge>);
    const badge = screen.getByText("Success Badge");
    expect(badge).toHaveClass("bg-primary text-white");
  });

  it("applies the outline variant class", () => {
    render(<Badge variant="outline">Outline Badge</Badge>);
    const badge = screen.getByText("Outline Badge");
    expect(badge).toHaveClass("border border-outline-variant");
  });

  it("merges custom className correctly", () => {
    render(<Badge className="custom-class">Custom Badge</Badge>);
    const badge = screen.getByText("Custom Badge");
    expect(badge).toHaveClass("custom-class");
    expect(badge).toHaveClass("bg-primary-container text-on-primary-container"); // still has default variant classes
  });
});
