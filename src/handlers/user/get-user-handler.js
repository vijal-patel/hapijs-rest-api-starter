import { getUserController } from "../../controllers/user-controller.js";
import { BadRequestError } from "../../models/errors.js";
import { handleHTTPError } from "../../utils/http-response.js";

export const getUserHandler = async (request, h) => {
  let response;

  try {
    let id = request.params.id ?? "";
    if (!id && request.auth.credentials._id) {
      id = request.auth.credentials._id;
    }
    let result;
    if (id) {
      result = await getUserController(id, request.server.app.mongodb);
    } else {
      throw new BadRequestError("User id not specified");
    }
    response = h.response(result.item).code(result.statusCode);
  } catch (err) {
    response = handleHTTPError(request, h, err);
  }

  return response;
};
