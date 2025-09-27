import {
  getTokenData,
  getUserImage,
  KOSEnvironment,
} from "@foodology-co/alejandria";
import appConfig, { AppConfig } from "config/app";
import { emptyUser, User } from "core/account/entities/User";
import { CanGetUser } from "core/account/interfaces/user/canGetUser";
import { getCookie, removeAllAlejandriaCookies } from "utils/cookie";
import { ApiVersion, postHttp } from "utils/http";
import { sessionValidator } from "utils/session";

export class UserHTTPRepository implements CanGetUser {
  constructor(private readonly config: AppConfig) {}

  public getUser(): User {
    const authorization = getCookie("authorization");
    if (!authorization) return emptyUserValidator();

    const tokenData = getTokenData(authorization);
    if (!tokenData) return emptyUserValidator();

    const user: User = {
      _id: tokenData.userId,
      username: tokenData.username,
      profile: {
        firstName: tokenData.firstName,
        lastName: tokenData.lastName,
        name: tokenData.name,
        position: tokenData.position,
        identification: tokenData.identification,
        country: tokenData.country,
        kitchenId: tokenData.kitchenId ?? "",
      },
      role: tokenData.roles?.[0] ?? "COCINERO",
      profileImage: getUserImage(
        this.config.env as KOSEnvironment,
        tokenData.userId
      ),
    };

    return user;
  }
}

export const emptyUserValidator = (): User => {
  sessionValidator(undefined);
  return emptyUser;
};

export const getUserLogOut = async () => {
  await postHttp(appConfig.kitchenDisplay.url, ApiVersion.API, "user/log-out");
  removeAllAlejandriaCookies();
};
