import { Request, Response } from "express";
import { CommonService } from "./publicServices";

export class CommonController {
  private flightService: CommonService;
  constructor() {
    this.flightService = new CommonService();
  }

  async getAllAirports(req: Request, res: Response) {
    try {
      const flights = await this.flightService.getAllAirports();
      res.json(flights);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
