import NodeCache from "node-cache";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../errors/AppError";
import { MakeRequest } from "../utils/request/request";
import db from "../database/db";

abstract class AbstractServices {
  protected db = db;

  protected cache = new NodeCache({ stdTTL: 35 * 60, checkperiod: 120 }); // TTL = 10 mins, check every 120 seconds

  protected Req = new MakeRequest();

  protected throwError(message: string, status: number) {
    throw new AppError(message, status);
  }

  protected createSession = () => {
    return uuidv4() + Date.now();
  };
}

export default AbstractServices;
