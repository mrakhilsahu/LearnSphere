// Nodemailer is used to send emails from Node.js applications
import nodemailer from "nodemailer";

/*
  This utility sends emails.
  Used in:
  - OTP verification
  - Reset password emails
*/

// email  -> receiver email address
// title  -> email subject
// body   -> HTML content of the email
const mailSender = async (email, title, body) => {

  /*
    Transporter defines how emails are sent.
    SMTP configuration is taken from environment variables.
  */
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST, // e.g. smtp.gmail.com
    port: 587,
    secure: false, // TLS

    auth: {
      user: process.env.MAIL_USER, // sender email
      pass: process.env.MAIL_PASS, // email password / app password
    },
  });

  /*
    sendMail actually sends the email
    html allows styled email content
  */
  const info = await transporter.sendMail({
    from: `"LMS" <${process.env.MAIL_USER}>`, // sender name
    to: email,
    subject: title,
    html: body,
  });

  // returns info like messageId, response, accepted emails
  return info;
};

export default mailSender;
