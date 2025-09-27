import { createAsyncThunk } from "@reduxjs/toolkit";
import appConfig from "config/app";
import { SessionCookieRepository } from "core/account/repositories/cookie/session";
import { UserHTTPRepository } from "core/account/repositories/http/user";
import { GetSessionUseCase } from "core/account/useCases/session/getSession";
import { GetUserUseCase } from "core/account/useCases/user/getUser";

export const getSession = createAsyncThunk("session/getSession", async () => {
  const cookieRepository = new SessionCookieRepository();
  const getSessionUseCase = new GetSessionUseCase(cookieRepository);
  const session = getSessionUseCase.execute();
  return session;
});

export const getUser = createAsyncThunk("user/getUser", async () => {
  const httpRepository = new UserHTTPRepository(appConfig);
  const getUserUseCase = new GetUserUseCase(httpRepository);
  const user = getUserUseCase.execute();
  return user;
});
