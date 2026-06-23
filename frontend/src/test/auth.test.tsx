import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AuthProvider, useAuth } from "../hooks/use-auth";

const mockStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockStorage });

describe("useAuth hook", () => {
  it("initializes with null user when no token", () => {
    mockStorage.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useAuth(), { wrapper: ({children}: any) => <AuthProvider>{children}</AuthProvider> });
    expect(result.current.user).toBeNull();
    expect(result.current.roles).toEqual([]);
  });
});
