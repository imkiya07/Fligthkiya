import { Request } from "express";
import AbstractServices from "../../../core/abstract/abstract.services";
import { ITravellersBody } from "./travelers.interfaces";
import { AirTravelersModel } from "./travelers.models";

export class TravelersService extends AbstractServices {
  constructor() {
    super();
  }

  // Create a new traveler
  createTraveler = async (req: Request) => {
    const body = req.body as ITravellersBody;
    const conn = new AirTravelersModel(this.db);

    const id = await conn.createTraveler({ ...body, user_id: req.user_id });

    return {
      success: true,
      message: "Traveler created successfully",
      data: {
        id,
      },
    };
  };

  // Retrieve a traveler by ID
  getTravelerById = async (req: Request) => {
    const { id } = req.params;
    const conn = new AirTravelersModel(this.db);

    const traveler = await conn.getTravelerById(Number(id));
    if (!traveler) {
      return {
        success: false,
        message: "Traveler not found",
      };
    }

    return {
      success: true,
      data: traveler,
    };
  };

  // Retrieve all travelers
  getAllTravelers = async (req: Request) => {
    const conn = new AirTravelersModel(this.db);

    const travelers = await conn.getAllTravelers(req.user_id);

    return {
      success: true,
      data: travelers,
    };
  };

  // Update traveler details
  updateTraveler = async (req: Request) => {
    const { id } = req.params;
    const body = req.body as ITravellersBody;
    const conn = new AirTravelersModel(this.db);

    const updatedTraveler = await conn.updateTraveler(Number(id), body);

    if (!updatedTraveler) {
      return {
        success: false,
        message: "Traveler not found or not updated",
      };
    }

    return {
      success: true,
      message: "Traveler updated successfully",
      data: updatedTraveler,
    };
  };

  // Delete a traveler
  deleteTraveler = async (req: Request) => {
    const { id } = req.params;
    const conn = new AirTravelersModel(this.db);

    const traveler = await conn.getTravelerById(Number(id));
    if (!traveler) {
      return {
        success: false,
        message: "Traveler not found",
      };
    }

    await conn.deleteTraveler(Number(id));

    return {
      success: true,
      message: "Traveler deleted successfully",
    };
  };
}
