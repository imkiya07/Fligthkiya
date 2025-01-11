import { Request, Response } from "express";
import { AbstractController } from "../../../core/abstract/abstractController";
import { B2cUsersServices } from "./b2cUsers.services";

export class B2cUsersController extends AbstractController {
  private services = new B2cUsersServices();
  constructor() {
    super();
  }

  public getBookings = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.getBookings(req);
    res.json(data);
  });

  public addCancelBooking = this.wrapAsync(
    async (req: Request, res: Response) => {
      const data = await this.services.addCancelBooking(req);
      res.json(data);
    }
  );

  public getCancelBooking = this.wrapAsync(
    async (req: Request, res: Response) => {
      const data = await this.services.getCancelBooking(req);
      res.json(data);
    }
  );

  public updateUserProfile = this.wrapAsync(
    async (req: Request, res: Response) => {
      const data = await this.services.updateUserProfile(req);
      res.json(data);
    }
  );

  public getProfileInfo = this.wrapAsync(
    async (req: Request, res: Response) => {
      const data = await this.services.getProfileInfo(req);
      res.json(data);
    }
  );

  public sendVerificationEmail = this.wrapAsync(
    async (req: Request, res: Response) => {
      const data = await this.services.sendVerificationEmail(req);
      res.json(data);
    }
  );

  public verifyProfile = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.verifyProfile(req);
    res.json(data);
  });

  // Update profile picture
  public updateProfilePicture = this.wrapAsync(
    async (req: Request, res: Response) => {
      const { user_id } = req; // Extract user_id from request
      const imgUrl = req.imgUrl; // Get file path from multer

      if (!imgUrl) {
        res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
        return;
      }

      const data = await this.services.updateProfilePicture(user_id, imgUrl);

      if (!data.success) {
        res.status(404).json(data);
      } else {
        res.json(data);
      }
    }
  );
}
