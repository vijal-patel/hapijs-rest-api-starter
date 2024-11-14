import { loginHandler } from "./login-handler.js";
import {
  passwordResetCodeHandler,
  passwordResetHandler,
} from "./pwd-reset-handler.js";
const noAuth = false;
export const authRoutes = [
  {
    method: "POST",
    path: "/api/v1/login",
    handler: loginHandler,
    options: {
      auth: noAuth,
    },
  },
  {
    method: "POST",
    path: "/api/v1/users/password/resetcode",
    handler: passwordResetCodeHandler,
    options: {
      auth: noAuth,
    },
  },
  {
    method: "POST",
    path: "/api/v1/users/password/reset",
    handler: passwordResetHandler,
    options: {
      auth: noAuth,
    },
  },
];
