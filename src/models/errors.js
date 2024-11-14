export class HttpError extends Error {
  statusCode;
  context;
  constructor(message, statusCode, context = null) {
    super(message);
    this.statusCode = statusCode;
    this.context = context;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class BadRequestError extends Error {
  context;
  constructor(message, context = null) {
    super(message);
    this.context = context;
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class AuthError extends Error {
  context;
  constructor(message, context = null) {
    super(message);
    this.context = context;
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}
