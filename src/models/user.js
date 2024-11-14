import Joi from "joi";
import { ObjectId } from "mongodb";

// export interface User {
//     password;
//     email;
//     firstName;
//     lastName;
//     createdAt?: Date;
//     updatedAt?: Date;
//     emailConfirmed;
//     linkedCompanyIds?: Array<string>;
//     _id?Id;
//     otp?: {
//         verificationCode;
//         expirationDate: number;
//     };
// }

export const createUserSchema = Joi.object().keys({
  _id: Joi.forbidden(),

  firstName: Joi.string()
    .min(1)
    .required()
    .error(new Error("Invalid first name")),

  lastName: Joi.string()
    .min(1)
    .required()
    .error(new Error("Invalid last name")),

  password: Joi.string()
    .pattern(new RegExp("^(?=.{8,}$)(?=.*[A-Za-z])(?=.*[0-9]).*"))
    .required()
    .error(
      new Error(
        "Password must be minimum of 8 characters with at least 1 alphabet and 1 number"
      )
    ),

  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required()
    .error(new Error("Invalid email")),

  createdAt: Joi.date(),
  captchaToken: Joi.string().required(),
  updatedAt: Joi.date(),
});

export const updateUserSchema = Joi.object().keys({
  firstName: Joi.string().min(1).error(new Error("Invalid first name")),

  lastName: Joi.string().min(1).error(new Error("Invalid last name")),

  password: Joi.forbidden(),

  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .error(new Error("Invalid email")),

  createdAt: Joi.date().forbidden(),

  updatedAt: Joi.date().error(new Error("Invalid date")),

  _id: Joi.forbidden(),
});
