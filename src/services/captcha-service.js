import { HttpError } from "../models/errors.js";

const verifyHcaptcha = async (token) => {
  const response = await fetch(process.env.HCAPTCHA_VERIFY_URL, {
    method: "POST",
    body: JSON.stringify({
      secret: process.env.HCAPTCHA_SECRET,
      response: token,
    }),
  });
  if (!response.ok) {
    throw new HttpError("Captcha validation failed", 400);
  }
};

export const verifyCaptcha = async (token) => {
  await verifyHcaptcha(token);
};
