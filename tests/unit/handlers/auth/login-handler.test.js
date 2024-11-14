import { jest } from "@jest/globals";

jest.unstable_mockModule("../../../../src/controllers/auth-controller", () => ({
  __esModule: true,
  handleLoginController: jest.fn(),
}));

jest.unstable_mockModule("../../../../src/utils/http-response", () => ({
  __esModule: true,
  handleHTTPError: jest.fn(),
}));

const { loginHandler } = await import(
  "../../../../src/handlers/auth/login-handler"
);

const { handleLoginController } = await import(
  "../../../../src/controllers/auth-controller"
);
const { handleHTTPError } = await import("../../../../src/utils/http-response");
describe("loginHandler", () => {
  const mockRequest = {
    payload: { username: "user", password: "pwd" },
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

  it("should return a http 200 response on successful login", async () => {
    const mockResult = {
      message: "Login successful",
      item: {
        token: "token",
        user: { id: "id", name: "user" },
      },
      statusCode: 200,
    };
    handleLoginController.mockResolvedValue(mockResult);

    const response = await loginHandler(mockRequest, mockH);

    expect(handleLoginController).toHaveBeenCalledWith(
      mockRequest.payload,
      mockRequest.server.app.mongodb
    );
    expect(mockH.response).toHaveBeenCalledWith({
      message: mockResult.message,
      token: mockResult.item.token,
      user: mockResult.item.user,
    });
    expect(mockH.code).toHaveBeenCalledWith(mockResult.statusCode);
    expect(response).toBe(mockH);
  });

  it("should call handleHTTPError if an error occurs", async () => {
    const mockError = new Error("Error occured");
    handleLoginController.mockRejectedValue(mockError);

    await loginHandler(mockRequest, mockH);

    expect(handleLoginController).toHaveBeenCalledWith(
      mockRequest.payload,
      mockRequest.server.app.mongodb
    );
    expect(handleHTTPError).toHaveBeenCalledWith(mockRequest, mockH, mockError);
  });
});
