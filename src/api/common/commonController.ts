import { Request, Response } from "express";
import { AbstractController } from "../../core/abstract/abstractController";
import { CommonService } from "./commonServices";
const path = require("path");
const fs = require("fs");

export class CommonController extends AbstractController {
  private services: CommonService;

  constructor() {
    super();
    this.services = new CommonService();
  }

  // create session id
  public createSession = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.createMYSTIFLYSession(req);
    res.json(data);
  });

  // Use an arrow function
  public getAllAirports = this.wrapAsync(
    async (req: Request, res: Response) => {
      const data = await this.services.getAllAirports(req);
      res.json(data);
    }
  );

  // DOWNLOAD ERR LOGS
  public downloadErrLogs = this.wrapAsync(
    async (req: Request, res: Response) => {
      const filePath = path.resolve(__dirname, "../../../logs/error.log");

      fs.access(filePath, fs.constants.F_OK, (err: any) => {
        if (err) {
          console.error("File does not exist:", err);
          return res.status(404).send("Log file not found");
        }

        res.download(filePath, "error.log", (err) => {
          if (err) {
            console.error("Error downloading the file:", err);
            res.status(500).send("Error downloading the file");
          }
        });
      });
    }
  );

  public clearErrLogs = this.wrapAsync(async (req: Request, res: Response) => {
    const filePath = path.join(__dirname, "../../../logs/error.log");

    // Use fs.truncate to empty the file
    fs.truncate(filePath, 0, (err: any) => {
      if (err) {
        console.error("Error clearing the file:", err);
        return res.status(500).send("Error clearing the file");
      }
      res.send("File cleared successfully");
    });
  });

  public downloadAllLogs = this.wrapAsync(
    async (req: Request, res: Response) => {
      const filePath = path.resolve(__dirname, "../../../logs/all.log");

      fs.access(filePath, fs.constants.F_OK, (err: any) => {
        if (err) {
          console.error("File does not exist:", err);
          return res.status(404).send("Log file not found");
        }

        res.download(filePath, "all.log", (err) => {
          if (err) {
            console.error("Error downloading the file:", err);
            res.status(500).send("Error downloading the file");
          }
        });
      });
    }
  );

  public clearAllLogs = this.wrapAsync(async (req: Request, res: Response) => {
    const filePath = path.join(__dirname, "../../../logs/all.log");

    // Use fs.truncate to empty the file
    fs.truncate(filePath, 0, (err: any) => {
      if (err) {
        console.error("Error clearing the file:", err);
        return res.status(500).send("Error clearing the file");
      }
      res.send("File cleared successfully");
    });
  });
}
