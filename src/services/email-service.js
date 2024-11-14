import {
  MAIL_JET_FROM_EMAIL,
  MAIL_JET_FROM_NAME,
  VERIFICATION_EMAIL_SUBJECT,
  VERIFICATION_EMAIL_TEMPLATE_ID,
} from "../constants/constants.js";

export const sendVerificationCodeEmail = async (
  client,
  email,
  userName,
  code
) => {
  const data = {
    Messages: [
      {
        From: {
          Email: MAIL_JET_FROM_EMAIL,
          Name: MAIL_JET_FROM_NAME,
        },
        To: [
          {
            Email: email,
            Name: userName,
          },
        ],
        TemplateID: VERIFICATION_EMAIL_TEMPLATE_ID,
        TemplateLanguage: true,
        Subject: VERIFICATION_EMAIL_SUBJECT,
        Variables: {
          name: userName,
          code,
        },
      },
    ],
  };
  return await sendEmail(client, data);
};

const sendEmail = async (client, data) => {
  return await client.post("send", { version: "v3.1" }).request(data);
};
