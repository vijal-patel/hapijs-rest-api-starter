import { verifyCaptcha } from "../../../src/services/captcha-service";
import { jest } from "@jest/globals";

describe("verifyCaptcha", () => {
  const validToken = "valid-token";
  const invalidToken = "invalid-token";
  let fetchMock;
  const HCAPTCHA_VERIFY_URL = process.env.HCAPTCHA_VERIFY_URL;
  const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET;
  beforeEach(() => {
    fetchMock = jest.spyOn(global, "fetch");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should not throw an error with a valid token", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    await expect(verifyCaptcha(validToken)).resolves.not.toThrow();

    expect(fetchMock).toHaveBeenCalledWith(HCAPTCHA_VERIFY_URL, {
      method: "POST",
      body: JSON.stringify({
        secret: HCAPTCHA_SECRET,
        response: validToken,
      }),
    });
  });

  it("should throw an error when captcha verification fails", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ success: false }),
    });

    await expect(verifyCaptcha(invalidToken)).rejects.toThrow(
      "Captcha validation failed"
    );

    expect(fetch).toHaveBeenCalledWith(HCAPTCHA_VERIFY_URL, {
      method: "POST",
      body: JSON.stringify({
        secret: HCAPTCHA_SECRET,
        response: invalidToken,
      }),
    });
  });
});
