import { Campus } from "./campusType";

export interface Subcampus {
  subcampusId: string;
  subcampusName: string;
  subcampusDescription: string;
  subcampusLocation: string;
  campus: Campus;
}