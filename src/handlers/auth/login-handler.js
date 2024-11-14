import { handleLoginController } from "../../controllers/auth-controller.js";
import { handleHTTPError } from "../../utils/http-response.js";

export const loginHandler = async (request, h) => {
  let response;
  const login = request.payload;
  try {
    const result = await handleLoginController(login, request.server.app.mongodb);
    response = h
      .response({
        message: result.message || "",
        token: result.item.token,
        user: result.item.user,
      })
      .code(result.statusCode);
  } catch (err) {
    response = handleHTTPError(request, h, err);
  }

  return response;
};
