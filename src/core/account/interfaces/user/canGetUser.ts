import { User } from "core/account/entities/User";

export interface CanGetUser {
  getUser(): User;
}
