// data/stationsData.js
import TramThi1 from "./TramThi1.js";
import TramThi2 from "./TramThi2.js";

export const stations = [TramThi1, TramThi2];
export const stationById = Object.fromEntries(stations.map(s => [s.tram_thi_ID, s]));
