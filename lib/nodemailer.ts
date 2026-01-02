import nodemailer from "nodemailer";
import config from "../config.js";

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: "apikey",
    pass: config.sendGridApiKey,
  },
  connectionTimeout: 20_000,
  greetingTimeout: 20_000,
  socketTimeout: 20_000,
});

export default transporter;
