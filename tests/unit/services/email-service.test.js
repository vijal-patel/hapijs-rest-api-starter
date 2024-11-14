import { MAIL_JET_FROM_EMAIL, MAIL_JET_FROM_NAME, VERIFICATION_EMAIL_SUBJECT, VERIFICATION_EMAIL_TEMPLATE_ID } from "../../../src/constants/constants";
import { sendVerificationCodeEmail } from "../../../src/services/email-service";
import { jest } from "@jest/globals";

describe("email service", () => {
  it("send verification email", async () => {
    const mockClient = {
      post: jest.fn().mockReturnThis(),
      request: jest.fn(),
    };
    const email = "test@test.com";
    const code = "123";
    const userName = "hi";
    const expectedData = {
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
            code: code,
          },
        },
      ],
    };
    await sendVerificationCodeEmail(mockClient, email, userName, code);
    expect(mockClient.post).toHaveBeenCalled();
    expect(mockClient.request).toHaveBeenCalledWith(expectedData);
  });
});
