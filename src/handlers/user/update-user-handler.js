import { updateUserController } from "../../controllers/user-controller.js";
import { BadRequestError } from "../../models/errors.js";
import { handleHTTPError } from "../../utils/http-response.js";

export const updateUserHandler = async (request, h) => {
  let response;

  try {
    const id = request.params.id ?? "";
    const updatedUser = request.payload ?? {};
    if (id) {
      const result = await updateUserController(
        id,
        updatedUser,
        request.server.app.mongodb
      );
      response = h
        .response({ message: result.message })
        .code(result.statusCode);
    } else {
      throw new BadRequestError("User id not specified");
    }
  } catch (err) {
    response = handleHTTPError(request, h, err);
  }
  return response;
};
