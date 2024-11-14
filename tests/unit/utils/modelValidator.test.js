import { loginSchema } from "../../../src/models/auth";
import { modelValidator } from "../../../src/utils/modelValidator";

describe("modelValidator", () => {
  test("should not throw error for a valid model", async () => {
    const loginModel = {
      email: "test@test.com",
      password: "super^Secur3Password",
    };
    await expect(
      modelValidator(loginModel, loginSchema)
    ).resolves.not.toThrow();
  });
  test("should throw an error for an invalid model", async () => {
    const loginModel = {
      email: "testtest.com",
      password: "123",
    };
    await expect(modelValidator(loginModel, loginSchema)).rejects.toThrow(
      "Invalid email"
    );
  });
});
