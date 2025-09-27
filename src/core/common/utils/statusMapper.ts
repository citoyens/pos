export type UnitNames = Record<string, string>;

export function statusMapper(status: string): string {
  const statusMapping: UnitNames = {
    FINISHED: "FINALIZADO",
    IN_PROCESS: "EN PROCESO",
    SCHEDULED: "PROGRAMADO"
  };

  return statusMapping[status];
}
