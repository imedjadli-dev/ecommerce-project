const nodemailer = require("nodemailer");

/**
 * Sends an email using Nodemailer
 *
 * @param {Object} options
 * @param {string} options.email - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Plain text message content
 * @param {string} [options.html] - Optional HTML version of the email
 */
const sendEmail = async (options) => {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_EMAIL ||
    !process.env.SMTP_PASSWORD
  ) {
    throw new Error("SMTP configuration missing in environment variables.");
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465, // SSL for port 465
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_EMAIL;
  const fromName = process.env.SMTP_FROM_NAME || "No-Reply";

  const mailOptions = {
    from: `${fromName} <${fromEmail}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || undefined, // Allow HTML if provided
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Email sending error:", err);
    throw new Error("Email could not be sent.");
  }
};

module.exports = sendEmail;
