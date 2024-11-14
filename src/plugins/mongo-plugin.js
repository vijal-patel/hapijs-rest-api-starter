import { MongoClient } from "mongodb";

const mongodbPlugin = {
  name: "mongodb",
  register: async function (server) {
    const client = new MongoClient(process.env[`MONGODB_URI`] || "");

    server.app.mongodb = client;
    server.log("info", "DB connected");
    server.ext({
      type: "onPostStop",
      method: async (server) => {
        await server.app.mongodb.close();
        server.log("info", "MongoDB connection closed.");
      },
    });
  },
};

export default mongodbPlugin;
