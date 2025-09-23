const nodemailer = require("nodemailer")


export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = (from : string, to : string, subject : string, text: string) => {
  const emailSent = {
    from,
    to,
    subject,
    text,
  };

  return transporter.sendMail(emailSent);
};
