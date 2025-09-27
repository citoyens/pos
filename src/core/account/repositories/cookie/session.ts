import { Session } from "core/account/entities/Session";
import { CanGetSession } from "core/account/interfaces/session/canGetSession";
import { getSession as getSessionUtils } from "utils/session";

export class SessionCookieRepository implements CanGetSession {
  public getSession(): Session {
    return getSessionUtils();
  }
}
