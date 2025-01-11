import { Request, Response } from "express";
import { AbstractController } from "../../../core/abstract/abstractController";
import { TravelersService } from "./travelers.services";

export class TravelersController extends AbstractController {
  private services = new TravelersService();

  constructor() {
    super();
  }

  // Create a new traveler
  public createTraveler = this.wrapAsync(
    async (req: Request, res: Response) => {
      const data = await this.services.createTraveler(req);
      res.status(201).json(data);
    }
  );

  // Get a traveler by ID
  public getTravelerById = this.wrapAsync(
    async (req: Request, res: Response) => {
      const data = await this.services.getTravelerById(req);
      if (!data.success) {
        res.status(404).json(data);
      } else {
        res.json(data);
      }
    }
  );

  // Get all travelers
  public getAllTravelers = this.wrapAsync(
    async (req: Request, res: Response) => {
      const data = await this.services.getAllTravelers(req);
      res.json(data);
    }
  );

  // Update a traveler by ID
  public updateTraveler = this.wrapAsync(
    async (req: Request, res: Response) => {
      const data = await this.services.updateTraveler(req);
      if (!data.success) {
        res.status(404).json(data);
      } else {
        res.json(data);
      }
    }
  );

  // Delete a traveler by ID
  public deleteTraveler = this.wrapAsync(
    async (req: Request, res: Response) => {
      const data = await this.services.deleteTraveler(req);
      if (!data.success) {
        res.status(404).json(data);
      } else {
        res.json(data);
      }
    }
  );
}
