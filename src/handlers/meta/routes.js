import { healthHandler } from "./health-handler.js";
const noAuth = false;
export const metaRoutes = [
  {
    method: "GET",
    path: "/api/v1/health",
    handler: healthHandler,
    options: {
      auth: noAuth,
    },
  },
];
