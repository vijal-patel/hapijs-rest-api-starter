import { DB_NAME } from "../constants/constants.js";
import { createUserSchema, updateUserSchema } from "../models/user.js";
import { deleteEntity, getEntity, updateEntity } from "../utils/db.js";
import { modelValidator } from "../utils/modelValidator.js";
import { hashPassword } from "./auth-service.js";
import { randomBytes } from "crypto";

const COLLECTION = "user";

export const createUser = async (user, client) => {
  await modelValidator(user, createUserSchema);
  // await createUserSchema.validateAsync(user);

  user.password = await hashPassword(user.password);
  user.createdAt = new Date();
  user.verificationCode = randomBytes(3).toString("hex");
  user.emailConfirmed = false;
  const res = await client.db(DB_NAME).collection(COLLECTION).insertOne(user);
  return res.insertedId;
};

export const updateUser = async (id, user, dbClient) => {
  await modelValidator(user, updateUserSchema);
  return updateEntity(id, user, dbClient, COLLECTION);
};

export const deleteUser = (id, dbClient) => {
  return deleteEntity(id, dbClient, COLLECTION);
};

export const getUser = (id, dbClient) => {
  return getEntity(id, dbClient, COLLECTION, {
    projection: { password: 0, verificationCode: 0 },
  });
};

export const getUserByEmail = async (
  email,
  client,
  includeAuthInfo = false
) => {
  const query = { email };
  const projection = includeAuthInfo
    ? {}
    : { projection: { password: 0, verificationCode: 0 } };
  return await client.db(DB_NAME).collection(COLLECTION).findOne(query, projection);
};
