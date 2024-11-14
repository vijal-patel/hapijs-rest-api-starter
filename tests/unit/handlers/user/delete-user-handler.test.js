import { jest } from "@jest/globals";
import { BadRequestError } from "../../../../src/models/errors";

jest.unstable_mockModule("../../../../src/controllers/user-controller", () => ({
  __esModule: true,
  deleteUserController: jest.fn(),
}));

jest.unstable_mockModule("../../../../src/utils/http-response", () => ({
  __esModule: true,
  handleHTTPError: jest.fn(),
}));

const { handleHTTPError } = await import("../../../../src/utils/http-response");

const { deleteUserHandler } = await import(
  "../../../../src/handlers/user/delete-user-handler"
);

const { deleteUserController } = await import(
  "../../../../src/controllers/user-controller"
);
describe("deleteUserHandler", () => {
  let mockRequest, mockH;
  const userId = "123";
  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      params: { id: userId },
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

  it("should return http status code 200 if the user was successfully deleted", async () => {
    const mockResult = {
      message: "User deleted",
      statusCode: 200,
    };
    deleteUserController.mockResolvedValue(mockResult);

    await deleteUserHandler(mockRequest, mockH);

    expect(deleteUserController).toHaveBeenCalledWith(
      userId,
      mockRequest.server.app.mongodb
    );
    expect(mockH.response).toHaveBeenCalledWith({
      message: mockResult.message,
    });
    expect(mockH.code).toHaveBeenCalledWith(mockResult.statusCode);
  });

  it("should throw a BadRequestError if no user ID is provided", async () => {
    mockRequest.params.id = "";

    await deleteUserHandler(mockRequest, mockH);

    expect(handleHTTPError).toHaveBeenCalled();
    const errorArg = handleHTTPError.mock.calls[0][2];
    expect(errorArg).toBeInstanceOf(BadRequestError);
    expect(errorArg.message).toBe("User id not specified");
  });

  it("should handle an error and call handleHTTPError if deleteUserController throws", async () => {
    const mockError = new Error("Database error");
    deleteUserController.mockRejectedValue(mockError);

    const result = await deleteUserHandler(mockRequest, mockH);

    expect(handleHTTPError).toHaveBeenCalledWith(mockRequest, mockH, mockError);
    expect(result).toBe(await handleHTTPError(mockRequest, mockH, mockError));
  });
});
