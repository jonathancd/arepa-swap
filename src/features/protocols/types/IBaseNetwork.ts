import { Protocol } from "../constants/Protocol";

export interface IBaseNetwork {
  id: number;
  name: string;
  icon: string;
  protocol: Protocol;
}
