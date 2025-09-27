import { AppConfig } from "config/app";
import { Menu } from "core/account/entities/Menu";
import { CanGetMenu } from "core/account/interfaces/menu/canGetMenu";
import { ApiVersion, getHttp } from "utils/http";

type MenuResponse = Array<{
  _id: string;
  icon: string;
  module: string;
  navigateTo: string;
  roles: string[];
  title: string;
  shortTitle: string;
  navigateEquals: null;
}>;

export class MenuHTTPRepository implements CanGetMenu {
  constructor(private readonly config: AppConfig) {}

  public async getMenu(): Promise<Menu> {
    const response = await getHttp(
      this.config.kitchenDisplay.url,
      ApiVersion.API,
      "menuByUser/avatar"
    );

    const menuJson: MenuResponse = await response.json();

    return { items: menuJson };
  }
}
