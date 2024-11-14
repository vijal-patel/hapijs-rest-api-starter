import { jest } from "@jest/globals";

jest.unstable_mockModule("../../../../src/utils/http-response", () => ({
  __esModule: true,
  handleHTTPError: jest.fn(),
}));

const { healthHandler } = await import(
  "../../../../src/handlers/meta/health-handler"
);
const { handleHTTPError } = await import("../../../../src/utils/http-response");

describe("healthHandler", () => {
  const mockRequest = {};
  const mockH = {
    response: jest.fn().mockReturnThis(),
    code: jest.fn().mockReturnThis(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return http status code 200", () => {
    const response = healthHandler(mockRequest, mockH);

    expect(mockH.response).toHaveBeenCalledWith({ message: "ok" });
    expect(mockH.code).toHaveBeenCalledWith(200);
    expect(response).toBe(mockH);
  });

  it("should call handleHTTPError on error", () => {
    mockH.response.mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    healthHandler(mockRequest, mockH);

    expect(handleHTTPError).toHaveBeenCalledWith(
      mockRequest,
      mockH,
      expect.any(Error)
    );
  });
});
