import { jest } from "@jest/globals";
import { BadRequestError } from "../../../../src/models/errors";

jest.unstable_mockModule("../../../../src/controllers/user-controller", () => ({
  __esModule: true,
  updateUserController: jest.fn(),
}));

jest.unstable_mockModule("../../../../src/utils/http-response", () => ({
  __esModule: true,
  handleHTTPError: jest.fn(),
}));

const { handleHTTPError } = await import("../../../../src/utils/http-response");

const { updateUserHandler } = await import(
  "../../../../src/handlers/user/update-user-handler"
);

const { updateUserController } = await import(
  "../../../../src/controllers/user-controller"
);
describe("updateUserHandler", () => {
  let mockRequest, mockH;
  const userId = "123";
  const firstName = "homer";
  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      params: { id: userId },
      payload: { firstName },
      logger: { info: jest.fn() },
      server: {
        app: {
          mongodb: {},
        },
      },
    };

    mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn(),
    };
  });

  it("should status code 200 if the user was successfully updated", async () => {
    const mockResult = {
      message: "User updated",
      statusCode: 200,
    };
    updateUserController.mockResolvedValue(mockResult);

    await updateUserHandler(mockRequest, mockH);

    expect(updateUserController).toHaveBeenCalledWith(
      userId,
      { firstName },
      mockRequest.server.app.mongodb
    );
    expect(mockH.response).toHaveBeenCalledWith({
      message: mockResult.message,
    });
    expect(mockH.code).toHaveBeenCalledWith(mockResult.statusCode);
  });

  it("should throw a BadRequestError if no user ID is provided", async () => {
    mockRequest.params.id = "";

    await updateUserHandler(mockRequest, mockH);

    expect(handleHTTPError).toHaveBeenCalled();
    const errorArg = handleHTTPError.mock.calls[0][2];
    expect(errorArg).toBeInstanceOf(BadRequestError);
    expect(errorArg.message).toBe("User id not specified");
  });

  it("should handle an error and call handleHTTPError if updateUserController throws", async () => {
    const mockError = new Error("Database error");
    updateUserController.mockRejectedValue(mockError);

    const result = await updateUserHandler(mockRequest, mockH);

    expect(handleHTTPError).toHaveBeenCalledWith(mockRequest, mockH, mockError);
    expect(result).toBe(await handleHTTPError(mockRequest, mockH, mockError));
  });
});
