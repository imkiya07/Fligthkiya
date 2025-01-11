import cookieParser from "cookie-parser";
import crypto from "crypto";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import nodemailer from "nodemailer";
import { generateEmailTemplate } from "./api/payments/payment.utils";
import { app } from "./app";
import requestLogger from "./core/utils/logger/reqLogger";
import { errorHandler } from "./middlewares/errorHandler";
import { registerRoutes } from "./routes/routes";
import express from "express";
import path from "path";

// Load environment variables from .env file
dotenv.config();

// Set the port from the environment or fallback to config
const PORT = process.env.PORT || 4001;

app.use(errorHandler);
app.use(requestLogger);
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((req, res, next) => {
  const userAgent = req.get("User-Agent") || "";
  const acceptLanguage = req.get("Accept-Language") || "";
  const acceptEncoding = req.get("Accept-Encoding") || "";

  const fingerprintString = `${userAgent}-${acceptLanguage}-${acceptEncoding}`;
  const uniqueIdentifier = crypto
    .createHash("sha256")
    .update(fingerprintString)
    .digest("hex");

  req.deviceId = uniqueIdentifier;

  next();
});

// Register application routes
registerRoutes(app);

// Main route
app.get("/", (req: Request, res: Response) => {
  res.send(`Flight server is running... ${process.env.NODE_ENV}`);
});

app.get("/env", (req: Request, res: Response) => {
  const env = process.env;

  res.json(env);
});

// booking mail
app.get("/booking-mail", async (req: Request, res: Response) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Or another SMTP service
    auth: {
      user: process.env.EMAIL_SEND_EMAIL_ID,
      pass: process.env.EMAIL_SEND_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_SEND_EMAIL_ID, //"your-email@gmail.com",
    to: "nazmulhosenm668@gmail.com",
    subject: "Your Flight Booking Confirmation",
    html: generateEmailTemplate(bookingData),
  };

  await transporter.sendMail(mailOptions);

  res.json({ success: true, message: "Node mailer" });
});

// Route not found (404) handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// General error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error for debugging purposes
  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ==============================

const bookingData = {
  id: 59,
  orderNumber: "FL1734709073898",
  CountryCode: "91",
  AreaCode: null,
  PhoneNumber: "87657897",
  Email: "nazmulhosenm668@gmail.com",
  bookingStatus: "PENDING",
  pnrId: "MF29068624",
  baseFare: null,
  taxAndCharge: null,
  discount: null,
  appliedCoupon: null,
  netTotal: null,
  paymentStatus: "SUCCESS",
  ticketStatus: "PENDING",
  paymentAt: "2024-12-20T15:38:38.000Z",
  departure_datetime: null,
  full_name: "MOHAMMED MUBARAK",
  username: "nazmulhosenm668",
  BookingCreatedOn: "2024-12-20T15:38:49",
  MFRef: "MF29068624",
  TripType: "Return",
  BookingStatus: "Booked",
  Origin: "DAC",
  Destination: "DAC",
  FareType: "Public",
  ClientUTCOffset: 0,
  TransactionDetails: {},
  BookingNotes: [],
  TicketingTimeLimit: "2024-12-23T15:38:49.407",
  BookingMode: 0,
  ReroutingAllowed: "NO",
  SpoilageFee: 0,
  DepAirportUTC: 0,
  IsRetainSegment: false,
  FlightId: 0,
  itineraries: [
    {
      ItemRPH: 1,
      DepartureDateTime: "2025-04-30T19:40:00",
      ArrivalDateTime: "2025-05-01T00:15:00",
      StopQuantity: 0,
      FlightNumber: "971",
      ResBookDesigCode: "W",
      JourneyDuration: "455",
      AirlinePNR: "5WMU9J",
      NumberInParty: 1,
      DepartureAirportLocationCode: "DAC",
      DepartureTerminal: "1",
      ArrivalAirportLocationCode: "CAI",
      ArrivalTerminal: "3",
      OperatingAirlineCode: "MS",
      AirEquipmentType: "789",
      MarketingAirlineCode: "MS",
      Baggage: "2PC",
      FlightStatus: "HK",
      IsReturn: false,
      CabinClass: "Y",
      FareFamily: "ECONOMY BEST OFFER",
    },
    {
      ItemRPH: 2,
      DepartureDateTime: "2025-05-01T06:20:00",
      ArrivalDateTime: "2025-05-01T10:55:00",
      StopQuantity: 0,
      FlightNumber: "985",
      ResBookDesigCode: "W",
      JourneyDuration: "695",
      AirlinePNR: "5WMU9J",
      NumberInParty: 1,
      DepartureAirportLocationCode: "CAI",
      DepartureTerminal: "3",
      ArrivalAirportLocationCode: "JFK",
      ArrivalTerminal: "1",
      OperatingAirlineCode: "MS",
      AirEquipmentType: "773",
      MarketingAirlineCode: "MS",
      Baggage: "2PC",
      FlightStatus: "HK",
      IsReturn: false,
      CabinClass: "Y",
      FareFamily: "ECONOMY BEST OFFER",
    },
    {
      ItemRPH: 3,
      DepartureDateTime: "2025-05-10T12:55:00",
      ArrivalDateTime: "2025-05-11T06:15:00",
      StopQuantity: 0,
      FlightNumber: "986",
      ResBookDesigCode: "S",
      JourneyDuration: "620",
      AirlinePNR: "5WMU9J",
      NumberInParty: 1,
      DepartureAirportLocationCode: "JFK",
      DepartureTerminal: "1",
      ArrivalAirportLocationCode: "CAI",
      ArrivalTerminal: "3",
      OperatingAirlineCode: "MS",
      AirEquipmentType: "773",
      MarketingAirlineCode: "MS",
      Baggage: "2PC",
      FlightStatus: "HK",
      IsReturn: true,
      CabinClass: "Y",
      FareFamily: "ECONOMY BEST OFFER",
    },
    {
      ItemRPH: 4,
      DepartureDateTime: "2025-05-11T07:50:00",
      ArrivalDateTime: "2025-05-11T18:10:00",
      StopQuantity: 0,
      FlightNumber: "970",
      ResBookDesigCode: "S",
      JourneyDuration: "440",
      AirlinePNR: "5WMU9J",
      NumberInParty: 1,
      DepartureAirportLocationCode: "CAI",
      DepartureTerminal: "3",
      ArrivalAirportLocationCode: "DAC",
      ArrivalTerminal: "1",
      OperatingAirlineCode: "MS",
      AirEquipmentType: "789",
      MarketingAirlineCode: "MS",
      Baggage: "2PC",
      FlightStatus: "HK",
      IsReturn: true,
      CabinClass: "Y",
      FareFamily: "ECONOMY BEST OFFER",
    },
  ],
  passengerInfos: [
    {
      Gender: "M",
      DateOfBirth: "1988-01-03T00:00:00",
      EmailAddress: "nazmulhosenm668@gmail.com",
      PhoneNumber: "87657897",
      PassportNationality: "Indian",
      PassengerNationality: "Indian",
      PostCode: "560028",
      PassportIssuanceCountry: "India",
      PassengerType: "ADT",
      PaxName: {
        PassengerTitle: "MR",
        PassengerFirstName: "MOHAMMED",
        PassengerLastName: "MUBARAK",
      },
      PassportNumber: "Z876789",
      NationalID: "IN",
      NameNumber: 444375,
    },
  ],
};
