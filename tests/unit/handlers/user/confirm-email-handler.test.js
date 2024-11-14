import { jest } from "@jest/globals";
import { BadRequestError } from "../../../../src/models/errors";

jest.unstable_mockModule("../../../../src/controllers/user-controller", () => ({
  __esModule: true,
  confirmEmailController: jest.fn(),
}));

jest.unstable_mockModule("../../../../src/utils/http-response", () => ({
  __esModule: true,
  handleHTTPError: jest.fn(),
}));

const { handleHTTPError } = await import("../../../../src/utils/http-response");

const { confirmEmailHandler } = await import(
  "../../../../src/handlers/user/confirm-email-handler"
);

const { confirmEmailController } = await import(
  "../../../../src/controllers/user-controller"
);
describe("confirmEmailHandler", () => {
  let mockRequest, mockH;
  const userId = "123";
  const verificationCode = "code";
  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      payload: { verificationCode },
      logger: { info: jest.fn() },
      id: "test-request-id",
      server: {
        app: {
          mongodb: {},
        },
      },
      auth: { credentials: { _id: userId } },
    };

    mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn(),
    };
  });

  it("should return http status code 200 if email is confirmed successfully", async () => {
    const mockResult = {
      message: "Email confirmed successfully",
      statusCode: 200,
    };
    confirmEmailController.mockResolvedValue(mockResult);

    await confirmEmailHandler(mockRequest, mockH);

    expect(confirmEmailController).toHaveBeenCalledWith(
      userId,
      verificationCode,
      mockRequest.server.app.mongodb
    );

    expect(mockH.response).toHaveBeenCalledWith({
      message: mockResult.message,
    });
    expect(mockH.code).toHaveBeenCalledWith(mockResult.statusCode);
  });

  it("should handle an error and call handleHTTPError if an error is thrown", async () => {
    const mockError = new Error("mock error");
    confirmEmailController.mockRejectedValue(mockError);

    await confirmEmailHandler(mockRequest, mockH);

    expect(handleHTTPError).toHaveBeenCalledWith(mockRequest, mockH, mockError);
  });
});
