import Mailjet from "node-mailjet";

const mailPlugin = {
  name: "mail",
  register: async function (server) {
    const client = new Mailjet({
      apiKey: process.env.MAIL_JET_API_KEY,
      apiSecret: process.env.MAIL_JET_API_SECRET,
    });
    server.app.mail = client;
  },
};

export default mailPlugin;
