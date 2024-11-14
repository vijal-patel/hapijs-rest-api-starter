import { BadRequestError } from "../models/errors.js";

export const modelValidator = async (entity, validationSchema) => {
  try {
    await validationSchema.validateAsync(entity);
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};
