import { Request, Response } from "express";
import { FlightService } from "./flightService";

export class FlightController {
  private flightService: FlightService;
  constructor() {
    this.flightService = new FlightService();
  }

  async flightSearch(req: Request, res: Response) {
    try {
      const flights = await this.flightService.flightSearch(req);
      res.json(flights);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getFlights(req: Request, res: Response) {
    try {
      const flights = await this.flightService.getAllFlights();
      res.json(flights);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getFlightById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const flight = await this.flightService.getFlightById(+id);
      if (flight) {
        res.json(flight);
      } else {
        res.status(404).json({ message: "Flight not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createFlight(req: Request, res: Response) {
    try {
      const flightData = req.body;
      await this.flightService.createFlight(flightData);
      res.status(201).json({ message: "Flight created successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateFlight(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const flightData = req.body;
      await this.flightService.updateFlight(id, flightData);
      res.json({ message: "Flight updated successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteFlight(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.flightService.deleteFlight(+id);
      res.json({ message: "Flight deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
