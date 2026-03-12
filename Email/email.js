import nodemailer from "nodemailer";
import { template } from "./emailTemplate.js";
import jwt from "jsonwebtoken";

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details
export async function sendEmail(email) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.APP_KEY,
    },
  });

  // Send an email using async/await
  let emailToken = jwt.sign(email, "emailToken");

  const info = await transporter.sendMail({
    from: '"From Node Lab <' + process.env.EMAIL_USER + ">",
    to: email,
    subject: "Welcome to NodeJS Lab",
    // text: "Hello world?", // Plain-text version of the message
    html: template(emailToken), // HTML version of the message
  });

  console.log("Message sent:", info.messageId);
}
