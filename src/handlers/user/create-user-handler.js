import { createUserController } from "../../controllers/user-controller.js";
import { handleHTTPError } from "../../utils/http-response.js";

export const createUserHandler = async (request, h) => {
  let response;
  try {
    const user = request["payload"]["user"];
    const captchaToken = request["payload"]["captchaToken"];
    const result = await createUserController(
      user,
      captchaToken,
      request.server.app.mongodb,
      request.server.app.mail
    );
    response = h
      .response({
        message: result.message,
        user: result.item,
      })
      .code(result.statusCode);
  } catch (err) {
    response = handleHTTPError(request, h, err);
  }

  return response;
};
