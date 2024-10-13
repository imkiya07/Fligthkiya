import AbstractServices from "../../../../utils/abstracts/abstract.services";
import { FareRules } from "./fareRules.service";

export class PostbookingService extends AbstractServices {
  constructor() {
    super();
  }

  // NARROW SERVICES
  fareRules = new FareRules().fareRules;
}
