import { Router } from "express";
import { upload } from "../../../core/multer/multer";
import { B2cUsersController } from "./b2cUsers.controllers";

export class B2cUsersRoute {
  public router: Router;
  private controllers = new B2cUsersController();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .route("/profile")
      .get(this.controllers.getProfileInfo)
      .patch(this.controllers.updateUserProfile);

    this.router
      .route("/cancel-booking-req")
      .get(this.controllers.getCancelBooking)
      .post(this.controllers.addCancelBooking);

    this.router.get("/bookings", this.controllers.getBookings);

    this.router.put(
      "/profile-picture",
      upload.single("image"),
      this.controllers.updateProfilePicture
    );

    this.router.patch("/verify", this.controllers.sendVerificationEmail);
    this.router.patch("/verify/:token", this.controllers.verifyProfile);
  }
}
