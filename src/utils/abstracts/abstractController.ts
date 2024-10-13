import { NextFunction, Request, Response } from "express";
import { wrapAsync } from "../../middlewares/asyncWrapper";

export abstract class AbstractController {
  protected wrapAsync(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) {
    return wrapAsync(fn);
  }
}
