import { KOSEnvironment, KOSTopbar } from "@foodology-co/alejandria";
import { useAppDispatch } from "app/components/PageHeader/hooks/useAppDispatch";
import { useAppSelector } from "app/components/PageHeader/hooks/useAppSelector";
import { toggleMenu } from "app/store/slices/menu";
import appConfig from "config/app";
import React from "react";
import { getUserLogOut } from "core/account/repositories/http/user";
import { setSearchOnTopBar } from "app/store/slices/global";

const TopBar = () => {
  const dispatch = useAppDispatch();
  const menuOpen = useAppSelector((state) => state.menu.open);
  const user = useAppSelector((state) => state.session.user.data);
  const session = useAppSelector((state) => state.session.data);
  const title = useAppSelector((state) => state.global.title);
  const canSearchOnTopBar = useAppSelector(
    (state) => state.global.canSearchOnTopBar
  );

  const onSearch = (textParam: string) =>
    dispatch(setSearchOnTopBar(textParam));
  const searchText = useAppSelector((state) => state.global.textSearchOnTopBar);

  const toggle = () => {
    dispatch(toggleMenu());
  };

  return (
    <KOSTopbar
      title={title ?? ""}
      hamburgerMenu={{
        open: menuOpen,
        onClick: toggle,
      }}
      search={{
        hide: !canSearchOnTopBar,
        value: searchText,
        onChange: onSearch,
      }}
      user={{
        name: user?.profile?.name ?? "",
        avatarUrl: user?.profileImage,
        companyId: session?.companyId ?? "fdgy",
      }}
      environment={appConfig.env as KOSEnvironment}
      accountMenu={{
        helpCenterLink:
          "https://foodology.notion.site/Centro-de-ayuda-para-cocinas-f49c4322877e428f907652f9b3d2783c",
        logOut: {
          redirect: `${appConfig.kitchenDisplay.url}/login`,
          onClick: getUserLogOut,
        },
      }}
    />
  );
};

export default TopBar;
