import { jest } from "@jest/globals";

jest.unstable_mockModule("../../../../src/controllers/user-controller", () => ({
  __esModule: true,
  createUserController: jest.fn(),
}));

jest.unstable_mockModule("../../../../src/utils/http-response", () => ({
  __esModule: true,
  handleHTTPError: jest.fn(),
}));

const { handleHTTPError } = await import("../../../../src/utils/http-response");

const { createUserHandler } = await import(
  "../../../../src/handlers/user/create-user-handler"
);

const { createUserController } = await import(
  "../../../../src/controllers/user-controller"
);

describe("createUserHandler", () => {
  let mockRequest, mockH;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      payload: {
        captchaToken: "123",
        user: { firstName: "Test", lastName: "Test", email: "test@test.com" },
      },
      logger: { info: jest.fn() },
      id: "123",
      server: {
        app: {
          mongodb: {},
          mail: {},
        },
      },
    };

    mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn(),
    };
  });

  it("should return http status code 201 if user creation was completed successfully", async () => {
    const mockResult = {
      message: "User created successfully",
      item: { id: "123", name: "John Doe", email: "john.doe@example.com" },
      statusCode: 201,
    };
    createUserController.mockResolvedValue(mockResult);

    await createUserHandler(mockRequest, mockH);

    expect(createUserController).toHaveBeenCalledWith(
      mockRequest.payload.user,
      mockRequest.payload.captchaToken,
      mockRequest.server.app.mongodb,
      mockRequest.server.app.mail
    );
    expect(mockH.response).toHaveBeenCalledWith({
      message: mockResult.message,
      user: mockResult.item,
    });
    expect(mockH.code).toHaveBeenCalledWith(mockResult.statusCode);
  });

  it("should handle an error and call handleHTTPError", async () => {
    const mockError = new Error("mock error");
    createUserController.mockRejectedValue(mockError);

    const result = await createUserHandler(mockRequest, mockH);

    expect(createUserController).toHaveBeenCalledWith(
      mockRequest.payload.user,
      mockRequest.payload.captchaToken,
      mockRequest.server.app.mongodb,
      mockRequest.server.app.mail
    );
    expect(handleHTTPError).toHaveBeenCalledWith(mockRequest, mockH, mockError);
    expect(result).toBe(await handleHTTPError(mockRequest, mockH, mockError));
  });
});
