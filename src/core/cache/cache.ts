import NodeCache from "node-cache";

// Create a single instance of NodeCache
export const cache = new NodeCache({ stdTTL: 35 * 60, checkperiod: 120 });
