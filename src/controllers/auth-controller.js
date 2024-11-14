import { randomBytes } from "crypto";

import { loginSchema, resetPasswordRequestSchema } from "../models/auth.js";
import {
  hashPassword,
  signJWT,
  verifyPassword,
} from "../services/auth-service.js";
import { modelValidator } from "../utils/modelValidator.js";
import { getUserByEmail, updateUser } from "../services/user-service.js";
import { HttpError } from "../models/errors.js";
import { sendVerificationCodeEmail } from "../services/email-service.js";

export const handleLoginController = async (login, dbClient) => {
  await modelValidator(login, loginSchema);
  const result = {};
  const user = await getUserByEmail(login.email, dbClient, true);
  if (!user) {
    throw new HttpError("Invalid username or password", 400);
  }
  const isPasswordValid = await verifyPassword(login.password, user.password);
  if (!isPasswordValid) {
    throw new HttpError("Invalid username or password", 400);
  }
  const token = await signJWT(user.email, user._id?.toString() || "");
  result.statusCode = 200;
  result.message = "Login successful";
  result.item = { token, user };

  return result;
};

export const handlePasswordResetCodeController = async (
  resetCodeRequest,
  dbClient
) => {
  const result = {};
  await modelValidator(resetCodeRequest, resetCodeRequestSchema);
  await verifyCaptcha(resetCodeRequest.captchaToken);
  const user = await getUserByEmail(resetCodeRequest.email, dbClient, {
    projection: { firstName: 1, _id: 1 },
  });
  if (!user) {
    result.statusCode = 400;
    result.message = "Error";
    return result;
  }
  result.statusCode = 200;
  result.message = `Please check your email for the verification code`;
  const verificationCode = randomBytes(3).toString("hex");
  const expirationDate = Date.now() + 86400000; // 1 day from now
  Promise.all([
    sendVerificationCodeEmail(
      resetCodeRequest.email,
      user.firstName,
      verificationCode
    ),
    new updateUser(
      user._id.toString(),
      { otp: { verificationCode, expirationDate } },
      dbClient
    ),
  ]);
  return result;
};

export const handlePasswordResetController = async (
  resetPasswordRequest,
  dbClient
) => {
  const result = {};
  await modelValidator(resetPasswordRequest, resetPasswordRequestSchema);

  const user = await getUserByEmail(resetPasswordRequest.email, dbClient, {
    projection: { verificationCode: 1, _id: 1 },
  });
  if (!user || !(user.otp && user.otp.verificationCode)) {
    result.statusCode = 403;
    result.message = `Validation code ${resetPasswordRequest.verificationCode} is no longer valid`;
    return result;
  }

  if (
    user.otp.verificationCode !==
    resetPasswordRequest.verificationCode.toLowerCase()
  ) {
    result.statusCode = 400;
    result.message = "Incorrect validation code";
    return result;
  }

  if (user.otp.expirationDate < Date.now()) {
    result.statusCode = 400;
    result.message = "Validation code expired";
    return result;
  }

  const hashedPassword = hashPassword(resetPasswordRequest.password);
  const userId = user._id?.toString() || "";
  const numModified = await updateUser(
    userId,
    { verificationCode: null, password: hashedPassword },
    request.server.app.mongodb
  );
  if (numModified == 0) {
    throw new HttpError(
      "Failed to update customer",
      500,
      `customer ${resetPasswordRequest.email} was not updated`
    );
  }
  result.statusCode = 200;
  const token = signJWT(resetPasswordRequest.email, userId);
  result.message = `Please check your email for the verification code`;
  result.item = { token };
  return result;
};
