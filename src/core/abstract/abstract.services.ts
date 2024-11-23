import NodeCache from "node-cache";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../errors/AppError";
import { MakeRequest } from "../utils/request/request";
import db from "../database/db";
import { cache } from "../cache/cache";

abstract class AbstractServices {
  protected db = db;

  protected cache = cache;

  protected Req = new MakeRequest();

  protected throwError(message: string, status: number) {
    throw new AppError(message, status);
  }

  protected createSession = () => {
    return uuidv4() + Date.now();
  };
}

export default AbstractServices;
