const fs = require("fs");
const PDFDocument = require("pdfkit");

export class BookingPDFService {
  static generateProfessionalPDF(data: any, filePath: string) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });

      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // Header with Color
      doc
        .rect(0, 0, 612, 80)
        .fill("#4A90E2")
        .fillColor("white")
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("Flight Booking Request", 50, 10);

      doc
        .fontSize(10)
        .text(`Booking No: ${data.orderNumber}`, 50, 40)
        .text(`Email: ${data.Email}`)
        .text(`Status: ${data.ticketStatus}`, 300, 40, { align: "right" });

      // Space below header
      doc.moveDown(3);

      // Booking Details Table
      doc
        .fillColor("black")
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Flight Details", { underline: true })
        .moveDown(0.5);

      doc.lineWidth(0.5).rect(50, doc.y, 500, 110).stroke();

      const bookingDetails = [
        ["Flight No", data.flightNo],
        ["Airline", data.airline_name],
        ["Departure Airport", data.departureAirportName],
        ["Arrival Airport", data.arrivalAirportName],
        ["Fly Date", data.DepartureDateTime],
        ["Arrival Date", data.ArrivalDateTime],
      ];

      bookingDetails.forEach(([key, value], index) => {
        doc
          .fontSize(12)
          .font("Helvetica")
          .text(key, 60, doc.y + (index === 0 ? 10 : 0))
          .text(value, 300, doc.y - 12);
      });

      doc.moveDown(2);

      data.passengerData.forEach((item: any, index: any) => {
        doc
          .fontSize(12)
          .font("Helvetica-Bold")
          .text(`Passener#${index + 1}`, 60);
        doc.lineWidth(0.5).rect(50, doc.y, 500, 75).stroke();

        const bookingDetails = [
          ["Type", item.PassengerType],
          ["Gender", item.Gender],
          [
            "Name",
            item.PassengerTitle +
              " " +
              item.PassengerFirstName +
              " " +
              item.PassengerLastName,
          ],
          ["Passport No", item.PassportNumber],
        ];

        bookingDetails.forEach(([key, value], index) => {
          doc
            .fontSize(12)
            .font("Helvetica")
            .text(key, 60, doc.y + (index === 0 ? 10 : 0))
            .text(value, 300, doc.y - 12);
        });

        doc.moveDown(3.0);
      });

      // Footer
      doc
        .fillColor("#4A90E2")
        .fontSize(10)
        .font("Helvetica-Oblique")
        .text(
          "For support, contact us at info@flightkiya.com or call +8801234567890.",
          50,
          700,
          { align: "center" }
        );

      doc.end();

      writeStream.on("finish", () => resolve(filePath));
      writeStream.on("error", (err: any) => reject(err));
    });
  }
}

export class PaymentPDFService {
  static generateProfessionalPDF(data: any, filePath: string) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });

      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // Agency Details
      const agencyName = "Flight Kiya";
      const agencyEmail = "info@adbiyastour.com";

      // Page Setup
      doc
        .fontSize(16)
        .font("Helvetica-Bold")
        .text(agencyName, { align: "center" });
      doc
        .fontSize(10)
        .font("Helvetica")
        .text(agencyEmail, { align: "center", margin: 0 });
      doc.moveDown();

      // Title
      doc
        .fontSize(20)
        .fillColor("#2E86C1") // Blue color
        .text("Payment Successful", { align: "center" });

      doc.moveDown();

      // Payment Details
      doc
        .fontSize(14)
        .fillColor("black")
        .text("Dear Customer,", { align: "left" });
      doc.text(
        "We are excited to inform you that your ticket payment has been successfully processed!",
        { align: "left" }
      );
      doc.moveDown();

      doc
        .fillColor("black")
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Booking Details", { underline: true })
        .moveDown(0.5);

      doc.lineWidth(0.5).rect(50, doc.y, 500, 155).stroke();

      const ticketDetails = [
        ["Ticket Status", data.ticketStatus],
        ["Order Number", data.orderNumber],
        ["Pnr Number", data.pnrId],
        ["Payment Status", data.paymentStatus],
        ["Payment Date", data.paymentAt],
        ["Tirp Type", data.TripType],
        ["Origin", data.Origin],
        ["Destination", data.Destination],
        ["Amount Paid", data.netTotal],
      ];

      ticketDetails.forEach(([key, value], index) => {
        doc
          .fontSize(12)
          .font("Helvetica")
          .text(key, 60, doc.y + (index === 0 ? 10 : 0))
          .text(value, 300, doc.y - 12);
      });

      doc.moveDown(2);

      data.passengerInfos.forEach((item: any, index: any) => {
        doc
          .fontSize(12)
          .font("Helvetica-Bold")
          .text(`Passener#${index + 1}`, 60);
        doc.lineWidth(0.5).rect(50, doc.y, 500, 75).stroke();

        const bookingDetails = [
          ["Type", item.PassengerType],
          ["Gender", item.Gender],
          [
            "Name",
            item.PaxName.PassengerTitle +
              " " +
              item.PaxName.PassengerFirstName +
              " " +
              item.PaxName.PassengerLastName,
          ],
          ["Passport No", item.PassportNumber],
        ];

        bookingDetails.forEach(([key, value], index) => {
          doc
            .fontSize(12)
            .font("Helvetica")
            .text(key, 60, doc.y + (index === 0 ? 10 : 0))
            .text(value, 300, doc.y - 12);
        });

        doc.moveDown(3.0);
      });

      doc
        .fillColor("black")
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Itinerary Details", { underline: true });

      data.itineraries.forEach((itinerary: any, index: any) => {
        doc
          .fontSize(12)
          .font("Helvetica-Bold")
          .text(`Flight#${index + 1}`, 60);
        doc.lineWidth(0.5).rect(50, doc.y, 500, 125).stroke();
        const ticketDetails = [
          [
            "Flight Number",
            itinerary.MarketingAirlineCode + itinerary.FlightNumber,
          ],
          [
            "Departure",
            new Date(itinerary.DepartureDateTime).toLocaleString() +
              ", " +
              itinerary.DepartureAirportLocationCode +
              " Terminal-" +
              itinerary.DepartureTerminal,
          ],
          [
            "Arrival",
            new Date(itinerary.ArrivalDateTime).toLocaleString() +
              ", " +
              itinerary.ArrivalAirportLocationCode +
              " Terminal-" +
              itinerary.ArrivalTerminal,
          ],
          [
            "Duration",
            (itinerary.JourneyDuration / 60).toFixed(2) +
              "h " +
              (itinerary.JourneyDuration % 60) +
              "m",
          ],
          ["Cabin Class", itinerary.CabinClass],
          ["Baggage", itinerary.Baggage],
          ["PNR", itinerary.AirlinePNR],
        ];

        ticketDetails.forEach(([key, value], index) => {
          doc
            .fontSize(12)
            .font("Helvetica")
            .text(key, 60, doc.y + (index === 0 ? 10 : 0))
            .text(value, 300, doc.y - 12);
        });
      });

      // Footer
      doc
        .fillColor("#4A90E2")
        .fontSize(10)
        .font("Helvetica-Oblique")
        .text(
          "For support, contact us at info@flightkiya.com or call +8801234567890.",
          50,
          700,
          { align: "center" }
        );

      doc.end();

      writeStream.on("finish", () => resolve(filePath));
      writeStream.on("error", (err: any) => reject(err));
    });
  }
}
