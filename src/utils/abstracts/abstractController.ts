import { NextFunction, Request, Response } from "express";
import { wrapAsync } from "../../middleware/asyncWrapper";

export abstract class AbstractController {
  protected wrapAsync(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) {
    return wrapAsync(fn); // Call the wrapAsync function directly
  }
}
