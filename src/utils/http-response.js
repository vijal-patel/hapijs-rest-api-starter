export const handleHTTPError = (request, h, err) => {
  request.logger.error(err.stack, request["id"]);
  request.logger.error({ payload: request.payload }, request["id"]);
  let statusCode = 500;
  let message = "An error occurred, please try again";
  if (err.constructor.name === "HttpError") {
    message = err.message;
    statusCode = err.statusCode;
    err.context &&
      request.logger.error({ Requestcontext: err.context }, request["id"]);
  } else if (err.constructor.name === "AuthError") {
    statusCode = 401;
    message = "Unauthenticated";
  } else if (err.constructor.name === "BadRequestError") {
    statusCode = 400;
    message = err.message;
  }
  const response = h.response({ message }).code(statusCode);
  return response;
};
