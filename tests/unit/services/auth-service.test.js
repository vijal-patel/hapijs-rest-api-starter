import { jest } from "@jest/globals";
const hashedPassword = "hashedPassword";

jest.unstable_mockModule("bcrypt", () => ({
  __esModule: true,
  hash: jest.fn().mockResolvedValue(hashedPassword),
  compare: jest.fn(),
}));

const { hash, compare } = await import("bcrypt");
const { hashPassword, verifyPassword } = await import(
  "../../../src/services/auth-service"
);

describe("auth service", () => {
  it("hashPassword should hash password", async () => {
    const password = "testPassword";
    const res = await hashPassword(password);
    expect(hash).toHaveBeenCalledWith(password, 10);
    expect(res).toBe(hashedPassword);
  });

  it("verifyPassword should return true if password is valid", async () => {
    const password = "testPassword";
    compare.mockResolvedValue(true);
    const res = await verifyPassword(password, hashedPassword);
    expect(compare).toHaveBeenCalledWith(password, hashedPassword);
    expect(res).toBe(true);
  });

  it("verifyPassword should return false if password is invalid", async () => {
    const password = "testPassword";
    compare.mockResolvedValue(false);
    const res = await verifyPassword(password, hashedPassword);
    expect(compare).toHaveBeenCalledWith(password, hashedPassword);
    expect(res).toBe(false);
  });
});
