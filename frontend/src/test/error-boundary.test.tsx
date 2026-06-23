import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ErrorBoundary } from "../components/error-boundary";

function Buggy() {
  throw new Error("Test Error");
  return <div>Not rendered</div>;
}

describe("ErrorBoundary", () => {
  it("catches error and renders fallback", () => {
    const originalError = console.error;
    console.error = () => {};

    render(
      <ErrorBoundary>
        <Buggy />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeTruthy();

    console.error = originalError;
  });
});
