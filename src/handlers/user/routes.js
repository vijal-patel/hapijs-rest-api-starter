import { confirmEmailHandler } from "./confirm-email-handler.js";
import { createUserHandler } from "./create-user-handler.js";
import { deleteUserHandler } from "./delete-user-handler.js";
import { getUserHandler } from "./get-user-handler.js";
import { updateUserHandler } from "./update-user-handler.js";
const noAuth = false;

export const userRoutes = [
  {
    method: "POST",
    path: "/api/v1/users",
    handler: createUserHandler,
    options: {
      auth: noAuth,
    },
  },
  {
    method: "GET",
    path: "/api/v1/users/{id}",
    handler: getUserHandler,
  },
  {
    method: "GET",
    path: "/api/v1/users",
    handler: getUserHandler,
  },
  {
    method: "POST",
    path: "/api/v1/users/confirmEmail",
    handler: confirmEmailHandler,
  },
  {
    method: "PATCH",
    path: "/api/v1/users/{id}",
    handler: updateUserHandler,
  },
  {
    method: "DELETE",
    path: "/api/v1/users/{id}",
    handler: deleteUserHandler,
  },
];
