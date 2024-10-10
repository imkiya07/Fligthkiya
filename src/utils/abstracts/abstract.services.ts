import NodeCache from 'node-cache';
import { MakeRequest } from '../request/request';


abstract class AbstractServices {
  protected cache = new NodeCache({ stdTTL: 10*60, checkperiod: 120 }); // TTL = 10 mins, check every 120 seconds

  protected Req = new MakeRequest();
}

export default AbstractServices;
