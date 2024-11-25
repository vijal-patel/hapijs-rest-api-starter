import { authRoutes } from "../handlers/auth/routes.js";
import { metaRoutes } from "../handlers/meta/routes.js";
import { userRoutes } from "../handlers/user/routes.js";

export async function loadRoutes(server) {
  server.route(metaRoutes);
  server.route(authRoutes);
  server.route(userRoutes);
}
