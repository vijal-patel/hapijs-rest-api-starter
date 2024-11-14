import { handleHTTPError } from "../../utils/http-response.js";
import {
  handlePasswordResetCodeController,
  handlePasswordResetController,
} from "../../controllers/auth-controller.js";

export const passwordResetCodeHandler = async (request, h) => {
  let response;
  try {
    const resetCodeRequest = request.payload;
    const result = await handlePasswordResetCodeController(
      resetCodeRequest,
      request.server.app.mongodb
    );
    response = h.response({ message: result.message }).code(result.statusCode);
  } catch (err) {
    response = handleHTTPError(request, h, err);
  }

  return response;
};

export const passwordResetHandler = async (request, h) => {
  let response;
  try {
    const resetCodeRequest = request.payload;
    const result = await handlePasswordResetController(
      resetCodeRequest,
      request.server.app.mongodb
    );
    response = h
      .response({ message: result.message, token: result.item })
      .code(result.statusCode);
  } catch (err) {
    response = handleHTTPError(request, h, err);
  }

  return response;
};
