import { createUserSchema, updateUserSchema } from "../models/user.js";
import {
  createUser,
  deleteUser,
  getUser,
  getUserByEmail,
  updateUser,
} from "../services/user-service.js";
import { modelValidator } from "../utils/modelValidator.js";
import { BadRequestError, HttpError } from "../models/errors.js";
import { sendVerificationCodeEmail } from "../services/email-service.js";
import { verifyCaptcha } from "../services/captcha-service.js";

export const createUserController = async (
  user,
  captchaToken,
  dbClient,
  mailClient
) => {
  await modelValidator(user, createUserSchema);
  await verifyCaptcha(captchaToken);
  const existingUser = await getUserByEmail(user.email, dbClient);
  if (existingUser) {
    throw new BadRequestError(
      "Please login instead, this account already exists",
      400
    );
  }
  const userId = await createUser(user, dbClient);
  user._id = userId;
  await sendVerificationCodeEmail(
    mailClient,
    user.email,
    user.firstName,
    user.verificationCode
  );
  const newUser = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    createdAt: user.createdAt,
    _id: user._id,
  };
  return {
    message: "User created successfully",
    statusCode: 201,
    item: newUser,
  };
};

export const getUserController = async (userId, dbClient) => {
  const user = await getUser(userId, dbClient);
  if (!user) {
    throw new HttpError("User not found", 404);
  }
  return { statusCode: 200, item: user };
};

export const updateUserController = async (userId, updateObject, dbClient) => {
  const user = await getUser(userId, dbClient);
  if (!user) {
    throw new HttpError("User not found", 404);
  }
  await modelValidator(updateObject, updateUserSchema);
  const numUsersModified = await updateUser(userId, updateObject, dbClient);
  if (numUsersModified == 0) {
    throw new HttpError(
      "Failed to update user",
      500,
      `user id ${userId} not updated`
    );
  }
  return { statusCode: 200, message: "User updated" };
};

export const deleteUserController = async (userId, dbClient) => {
  await deleteUser(userId, dbClient);
  return { statusCode: 200, message: "User deleted" };
};

export const confirmEmailController = async (
  userId,
  verificationCode,
  dbClient
) => {
  const user = await getUser(userId, dbClient);
  if (user.verificationCode === verificationCode && !user.emailConfirmed) {
    const numUsersModified = await updateUser(userId, {
      verificationCode: null,
      emailConfirmed: true,
    });
    if (numUsersModified == 0) {
      throw new HttpError(
        "Failed to update user",
        500,
        `user id ${userId} not updated`
      );
    }
  } else {
    throw BadRequestError("Invalid code");
  }

  return { statusCode: 200, message: "Email confirmed" };
};
