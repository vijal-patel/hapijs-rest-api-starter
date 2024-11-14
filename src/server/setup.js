import * as Hapi from "@hapi/hapi";
import HapiPino from "hapi-pino";
import { loadRoutes } from "./router.js";
import mongodbPlugin from "../plugins/mongo-plugin.js";
import * as dotenv from "dotenv";
import { plugin as jwtPlugin } from "@hapi/jwt";
import { jwtValidation } from "../services/auth-service.js";
import { randomUUID } from "crypto";
import llmPlugin from "../plugins/llm-plugin.js";
import mailPlugin from "../plugins/mail-plugin.js";
const port = process.env.PORT || 8080;
const server = Hapi.server({
  port,
  routes: {
    cors: true,
  },
});

export default async function setup() {
  const env = process.env.NODE_ENV || "dev";
  try {
    dotenv.config({
      path: `${process.cwd()}/${env}.env`,
    });

    server.ext("onRequest", (request, h) => {
      // trace id
      const uuid = randomUUID();
      request["id"] = uuid;
      h.response().header("x-trace-id", request["id"]);
      return h.continue;
    });

    server.ext("onPreResponse", (request, h) => {
      if ("header" in request.response) {
        request.response["header"]["x-trace-id"] = request["id"];
      } else {
        request.response["header"] = { "x-trace-id": ["id"] };
      }
      return h.continue;
    });

    // server.events.on("log", (event, tag) => {
    //   console.log(event);
    // });

    await server.register({
      plugin: HapiPino,
      options: {
        // Redact Authorization headers, see https://getpino.io/#/docs/redaction
        // redact: {
        //   paths: ["req.headers", "req.remoteAddress", "req.remotePort"],
        //   remove: true,
        // },
        // TODO https://github.com/pinojs/pino-toke for prod
        // ...(env === "dev" && { transport: { target: "pino-pretty" } }),
      },
    });

    await server.register([mongodbPlugin, llmPlugin, jwtPlugin, mailPlugin]);
    server.auth.strategy("multi-use-jwt", "jwt", {
      keys: process.env.JWT_SECRET,
      verify: {
        aud: false,
        iss: false,
        sub: false,
        nbf: true,
        exp: true,
        maxAgeSec: 14400, // 4 hours
        timeSkewSec: 15,
      },
      validate: (artifacts, request, h) => {
        let isValid = false;
        const header = request.headers.authorization;
        const headerSplit = header.split(" ");
        if (headerSplit.length) {
          isValid = jwtValidation(headerSplit[1]);
        }
        const validationResult = isValid
          ? { isValid }
          : { isValid, credentials: { user: artifacts.decoded.payload } };
        return validationResult;
      },
    });

    server.auth.default("multi-use-jwt");

    await loadRoutes(server);

    await server.start();

    server.log("info", `Server running http://localhost:${port}`);
  } catch (error) {
    console.error(`Error starting server: ${error}`);
    throw error;
  }
}

process.on("unhandledRejection", (err) => {
  console.error("unhandledRejection", err);
  process.exit(1);
});

process.on("SIGINT", () => {
  server.log("info", "SIGINT signal received.");
  server.stop();
});

process.on("SIGTERM", () => {
  server.log("info", "SIGTERM signal received.");
  server.stop();
});
