import express from "express";
import db from "../../config/db";
import { flightModel } from "./flight.models";
import { FlightController } from "./flightController";
import { FlightService } from "./flightService";

export const flightRoute = express.Router();

// Initialize flight model, service, and controller
const flightModels = new flightModel(db);
const flightServices = new FlightService(flightModels);
const flightController = new FlightController(flightServices);

// Define routes
flightRoute.get("/flights", (req, res) =>
  flightController.getFlights(req, res)
);
flightRoute.get("/flights/:id", (req, res) =>
  flightController.getFlightById(req, res)
);
flightRoute.post("/flights", (req, res) =>
  flightController.createFlight(req, res)
);
flightRoute.put("/flights/:id", (req, res) =>
  flightController.updateFlight(req, res)
);
flightRoute.delete("/flights/:id", (req, res) =>
  flightController.deleteFlight(req, res)
);
