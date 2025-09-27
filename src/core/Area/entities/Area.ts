import { Position } from "core/Position/entities/Position";

export interface AreaWithPositions {
  _id: string;
  name: string;
  companyId: string;
  status: string;
  positions: Omit<Position, "companyId" | "areaId">[];
}
