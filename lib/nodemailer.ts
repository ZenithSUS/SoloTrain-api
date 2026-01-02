import nodemailer from "nodemailer";
import config from "../config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.email,
    pass: config.emailPassword,
  },
  port: 587,
  host: "smtp.gmail.com",
});

export default transporter;
