import { Session } from "core/account/entities/Session";

export interface CanGetSession {
  getSession(): Session;
}
