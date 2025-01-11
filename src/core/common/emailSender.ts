const fs = require("fs");
const PDFDocument = require("pdfkit");
import nodemailer from "nodemailer";

export class EmailSend {
  static transporter = nodemailer.createTransport({
    service: "Gmail", // Or another SMTP service
    auth: {
      user: process.env.EMAIL_SEND_EMAIL_ID,
      pass: process.env.EMAIL_SEND_PASSWORD,
    },
  });

  static async sendEmailWithPDF(
    pdfPath: string,
    to: string,
    subject: string,
    text?: string
  ) {
    try {
      const mailOptions = {
        from: `"Flight kiya" <${process.env.EMAIL_SEND_EMAIL_ID}>`,
        to,
        subject,
        text: text || "Please find the attached PDF.",
        attachments: [
          {
            filename: "ticketBooking.pdf",
            path: pdfPath,
          },
        ],
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}
