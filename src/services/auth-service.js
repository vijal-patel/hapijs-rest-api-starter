import jwt from "jsonwebtoken";
import { compare, hash } from "bcrypt";

const SALT_ROUNDS = 10;

export const signJWT = async (email, id) => {
  return jwt.sign({ email, id }, process.env.JWT_SECRET);
};

export const jwtValidation = (jwtToValidate) => {
  try {
    jwt.verify(jwtToValidate, process.env.JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
};

export const hashPassword = async (password) => {
  return hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (password, hashedPassword) => {
  return compare(password, hashedPassword);
};
