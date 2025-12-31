
// Nodemailer is used to send emails from Node.js applications
import nodemailer from "nodemailer";

// email  -> receiver email address
// body   -> HTML content of the email
const mailSender = async (email, title, body) => {

  // transporter defines how the email will be sent (SMTP configuration)
  const transporter = nodemailer.createTransport({
    // mail server host (example: smtp.gmail.com)
    host: process.env.MAIL_HOST,
    port: 587,
    secure: false,

    auth: {
      // sender email address
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // sendMail actually sends the email
  const info = await transporter.sendMail({
    // sender name and email
    from: `"LMS" <${process.env.MAIL_USER}>`,
    to: email,
    subject: title,
    html: body,
  });

  // return information about the sent email
  return info;
};

export default mailSender;
