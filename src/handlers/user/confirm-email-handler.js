import { confirmEmailController } from "../../controllers/user-controller.js";
import { handleHTTPError } from "../../utils/http-response.js";

export const confirmEmailHandler = async (request, h) => {
  let response;

  try {
    const userId = request.auth.credentials._id;
    const verificationCode = request.payload.verificationCode;
    request.logger.info(userId, request["id"]);
    const result = await confirmEmailController(
      userId,
      verificationCode,
      request.server.app.mongodb
    );
    response = h
      .response({
        message: result.message,
      })
      .code(result.statusCode);
  } catch (err) {
    response = handleHTTPError(request, h, err);
  }

  return response;
};
