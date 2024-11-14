import { handleHTTPError } from "../../utils/http-response.js";

export const healthHandler = (request, h) => {
  let response;
  try {
    response = h
      .response({
        message: "ok",
      })
      .code(200);
  } catch (err) {
    response = handleHTTPError(request, h, err);
  }
  return response;
};
