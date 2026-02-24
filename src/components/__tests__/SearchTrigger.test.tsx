import { render, screen, fireEvent } from "@testing-library/react";
import { SearchTrigger } from "../SearchTrigger";
import { vi, describe, it, expect, beforeEach } from "vitest";
import * as navigation from "next/navigation";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

describe("SearchTrigger", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with correct accessibility attributes for English (default)", () => {
    vi.mocked(navigation.usePathname).mockReturnValue("/en");
    render(<SearchTrigger />);

    const button = screen.getByRole("button", { name: /search/i });
    expect(button).toBeInTheDocument();

    // Check for accessibility attributes
    expect(button).toHaveAttribute("aria-label", "Search (Cmd+K)");
    expect(button).toHaveAttribute("title", "Search (Cmd+K)");
    expect(button).toHaveAttribute("aria-keyshortcuts", "Meta+K");
  });

  it("renders with correct accessibility attributes for Farsi", () => {
    vi.mocked(navigation.usePathname).mockReturnValue("/fa");
    render(<SearchTrigger />);

    const button = screen.getByRole("button", { name: /جستجو/i });
    expect(button).toBeInTheDocument();

    expect(button).toHaveAttribute("aria-label", "جستجو (Cmd+K)");
    expect(button).toHaveAttribute("title", "جستجو (Cmd+K)");
    expect(button).toHaveAttribute("aria-keyshortcuts", "Meta+K");
  });

  it("renders with correct accessibility attributes for Spanish", () => {
    vi.mocked(navigation.usePathname).mockReturnValue("/es");
    render(<SearchTrigger />);

    const button = screen.getByRole("button", { name: /buscar/i });
    expect(button).toBeInTheDocument();

    expect(button).toHaveAttribute("aria-label", "Buscar (Cmd+K)");
    expect(button).toHaveAttribute("title", "Buscar (Cmd+K)");
  });

  it("triggers search event on click", () => {
    vi.mocked(navigation.usePathname).mockReturnValue("/en");
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    render(<SearchTrigger />);
    const button = screen.getByRole("button", { name: /search/i });

    fireEvent.click(button);

    expect(dispatchEventSpy).toHaveBeenCalled();
    const event = dispatchEventSpy.mock.calls[0][0] as KeyboardEvent;
    expect(event.type).toBe("keydown");
    expect(event.key).toBe("k");
    expect(event.metaKey).toBe(true);
  });
});
