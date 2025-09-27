export class SessionNotFoundError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, SessionNotFoundError.prototype);
  }
}
