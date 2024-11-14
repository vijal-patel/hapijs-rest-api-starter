import { jest } from "@jest/globals";
import { BadRequestError } from "../../../../src/models/errors";

jest.unstable_mockModule("../../../../src/controllers/user-controller", () => ({
  __esModule: true,
  getUserController: jest.fn(),
}));

jest.unstable_mockModule("../../../../src/utils/http-response", () => ({
  __esModule: true,
  handleHTTPError: jest.fn(),
}));

const { handleHTTPError } = await import("../../../../src/utils/http-response");

const { getUserHandler } = await import(
  "../../../../src/handlers/user/get-user-handler"
);

const { getUserController } = await import(
  "../../../../src/controllers/user-controller"
);

describe("getUserHandler", () => {
  let mockRequest, mockH;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      params: { id: "123" },
      auth: { credentials: { _id: "auth-123" } },
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

  it("should get a user by ID from request params and return the user data with status code", async () => {
    const mockResult = {
      item: { id: "123", name: "John Doe" },
      statusCode: 200,
    };
    getUserController.mockResolvedValue(mockResult);

    await getUserHandler(mockRequest, mockH);

    expect(getUserController).toHaveBeenCalledWith(
      "123",
      mockRequest.server.app.mongodb
    );
    expect(mockH.response).toHaveBeenCalledWith(mockResult.item);
    expect(mockH.code).toHaveBeenCalledWith(mockResult.statusCode);
  });

  it("should get a user by ID from request.auth.credentials if no params ID is provided", async () => {
    mockRequest.params.id = "";
    const mockResult = {
      item: { id: "auth-123", name: "Jane Doe" },
      statusCode: 200,
    };
    getUserController.mockResolvedValue(mockResult);

    await getUserHandler(mockRequest, mockH);

    expect(getUserController).toHaveBeenCalledWith(
      "auth-123",
      mockRequest.server.app.mongodb
    );
    expect(mockH.response).toHaveBeenCalledWith(mockResult.item);
    expect(mockH.code).toHaveBeenCalledWith(mockResult.statusCode);
  });

  it("should throw BadRequestError if params id nor auth credentials id is provided", async () => {
    mockRequest.params.id = "";
    mockRequest.auth.credentials._id = null;
    await getUserHandler(mockRequest, mockH);

    expect(handleHTTPError).toHaveBeenCalled();
    const errorClassArg = handleHTTPError.mock.calls[0][2];
    expect(errorClassArg).toBeInstanceOf(BadRequestError);
  });

  it("should handle an error and call handleHTTPError if getUserController throws an error", async () => {
    const mockError = new Error("mock error");
    getUserController.mockRejectedValue(mockError);

    const result = await getUserHandler(mockRequest, mockH);

    expect(handleHTTPError).toHaveBeenCalledWith(mockRequest, mockH, mockError);
    expect(result).toBe(await handleHTTPError(mockRequest, mockH, mockError));
  });
});
