import { jest } from "@jest/globals";

jest.unstable_mockModule("../../../../src/controllers/auth-controller", () => ({
  __esModule: true,
  handlePasswordResetCodeController: jest.fn(),
  handlePasswordResetController: jest.fn(),
}));

jest.unstable_mockModule("../../../../src/utils/http-response", () => ({
  __esModule: true,
  handleHTTPError: jest.fn(),
}));

const { handleHTTPError } = await import("../../../../src/utils/http-response");
const { passwordResetHandler, passwordResetCodeHandler } = await import(
  "../../../../src/handlers/auth/pwd-reset-handler"
);

const { handlePasswordResetCodeController, handlePasswordResetController } =
  await import("../../../../src/controllers/auth-controller");

describe("Password Reset Handlers", () => {
  const mockRequest = {
    payload: { email: "test@test.com", code: "123456" },
    server: {
      app: {
        mongodb: jest.fn(),
      },
    },
  };
  const mockH = {
    response: jest.fn().mockReturnThis(),
    code: jest.fn().mockReturnThis(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("passwordResetCodeHandler", () => {
    it("should return http 200 on a successful password reset code request", async () => {
      const mockResult = { message: "Code sent", statusCode: 200 };
      handlePasswordResetCodeController.mockResolvedValue(mockResult);

      const response = await passwordResetCodeHandler(mockRequest, mockH);

      expect(handlePasswordResetCodeController).toHaveBeenCalledWith(
        mockRequest.payload,
        mockRequest.server.app.mongodb
      );
      expect(mockH.response).toHaveBeenCalledWith({
        message: mockResult.message,
      });
      expect(mockH.code).toHaveBeenCalledWith(mockResult.statusCode);
      expect(response).toBe(mockH);
    });

    it("should call handleHTTPError if an error occurs", async () => {
      const mockError = new Error("Error sending code");
      handlePasswordResetCodeController.mockRejectedValue(mockError);

      await passwordResetCodeHandler(mockRequest, mockH);

      expect(handlePasswordResetCodeController).toHaveBeenCalledWith(
        mockRequest.payload,
        mockRequest.server.app.mongodb
      );
      expect(handleHTTPError).toHaveBeenCalledWith(
        mockRequest,
        mockH,
        mockError
      );
    });
  });

  describe("passwordResetHandler", () => {
    it("should return http 200 on successful password reset", async () => {
      const mockResult = {
        message: "Password reset successful",
        item: "new-token",
        statusCode: 200,
      };
      handlePasswordResetController.mockResolvedValue(mockResult);

      const response = await passwordResetHandler(mockRequest, mockH);

      expect(handlePasswordResetController).toHaveBeenCalledWith(
        mockRequest.payload,
        mockRequest.server.app.mongodb
      );
      expect(mockH.response).toHaveBeenCalledWith({
        message: mockResult.message,
        token: mockResult.item,
      });
      expect(mockH.code).toHaveBeenCalledWith(mockResult.statusCode);
      expect(response).toBe(mockH);
    });

    it("should call handleHTTPError if an error occurs", async () => {
      const mockError = new Error("Error occured");
      handlePasswordResetController.mockRejectedValue(mockError);

      await passwordResetHandler(mockRequest, mockH);

      expect(handlePasswordResetController).toHaveBeenCalledWith(
        mockRequest.payload,
        mockRequest.server.app.mongodb
      );
      expect(handleHTTPError).toHaveBeenCalledWith(
        mockRequest,
        mockH,
        mockError
      );
    });
  });
});
