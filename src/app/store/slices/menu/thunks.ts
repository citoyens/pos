import { createAsyncThunk } from "@reduxjs/toolkit";
import appConfig from "config/app";
import { MenuHTTPRepository } from "core/account/repositories/http/menu";
import { GetMenu } from "core/account/useCases/menu/getMenu";

export const getUserMenu = createAsyncThunk("user/getMenu", async () => {
  const httpRepository = new MenuHTTPRepository(appConfig);
  const getMenuUseCase = new GetMenu(httpRepository);
  const menu = await getMenuUseCase.execute();
  return menu;
});
