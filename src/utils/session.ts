import appConfig from "config/app";
import { emptySession, Session } from "core/account/entities/Session";
import { getCookie } from "./cookie";
import { getTokenData } from "@foodology-co/alejandria";

export const getLoginUrl = () => {
  const {
    kitchenDisplay: { url: kds },
    avatar: { url },
  } = appConfig;
  return `${kds}/login?redirect=${url}${window.location.pathname}`;
};

export const sessionValidator = (session?: Session) => {
  const redirect = getLoginUrl();

  if (!session) {
    console.error("Cookie session not found");
    window.location.href = redirect;
    return;
  }

  const { userId, token } = session;
  if (!userId || !token) {
    console.error("Cookie session not found");
    window.location.href = redirect;
  }
};

export const emptySesssionValidator = (): Session => {
  sessionValidator(undefined);
  return emptySession;
};

export const getSession = (): Session => {
  const authorization = getCookie("authorization");
  if (!authorization) return emptySesssionValidator();

  const tokenData = getTokenData(authorization);
  if (!tokenData) return emptySesssionValidator();

  const session: Session = {
    userId: tokenData.userId,
    token: tokenData.loginToken,
    companyId: tokenData.companyId,
    authorization: authorization,
  };

  sessionValidator(session);

  return session;
};
