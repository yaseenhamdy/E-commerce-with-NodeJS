import nodemailer from "nodemailer";
import { template } from "./emailTemplate.js";
import { orderStatusTemplate } from "./orderStatusTemplate.js";
import jwt from "jsonwebtoken";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.APP_KEY,
    },
  });
};

export async function sendEmail(email) {
  const transporter = createTransporter();

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

export async function sendGenericEmail({ to, subject, html }) {
  const transporter = createTransporter();

  const info = await transporter.sendMail({
    from: '"From Node Lab <' + process.env.EMAIL_USER + ">",
    to,
    subject,
    html,
  });

  console.log("Message sent:", info.messageId);
}

export async function sendOrderStatusEmail({ to, orderId, status }) {
  if (!to) return;

  try {
    await sendGenericEmail({
      to,
      subject: `Order ${orderId} status updated to ${status}`,
      html: orderStatusTemplate({ orderId, status }),
    });
  } catch (err) {
    console.error("Failed to send order status email:", err.message);
  }
}
