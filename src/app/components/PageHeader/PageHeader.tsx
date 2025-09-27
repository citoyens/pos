import { KOSPageHeader, KOSPageHeaderButton } from "@foodology-co/alejandria";
import { useAppDispatch } from "app/hooks/useAppDispatch";
import { useAppSelector } from "app/hooks/useAppSelector";
import { useNavigator } from "app/hooks/useNavigator";
import { clearTitle, setTitle } from "app/store/slices/global";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMount, useUnmount } from "react-use";
import { ObjectParams } from "utils/http";
import { getNavs, Module } from "utils/module";
import { TypeOfRole } from "utils/role";

interface Props {
  title: string;
  subtitle?: string;
  centerArea?: React.ReactElement;
  rightArea?: KOSPageHeaderButton[];
  hideNavBar?: boolean;
}

const PageHeader = (props: Props) => {
  const { title, subtitle, centerArea, rightArea, hideNavBar } = props;
  const dispatch = useAppDispatch();
  const navigator = useNavigator();
  const pathname = navigator.location();
  const params = navigator.params();
  const { t } = useTranslation();

  const user = useAppSelector((state) => state.session.user.data);
  const role = user?.role as TypeOfRole;
  const [navs, setNavs] = useState<Module[]>([]);

  useMount(() => {
    dispatch(setTitle(t(title)));
    if (!hideNavBar) {
      setNavs(
        getNavs([], role, pathname, params as ObjectParams).map((el) => {
          el["moduleName"] = t(el["moduleName"]);
          return el;
        })
      );
    }
  });

  useUnmount(() => {
    dispatch(clearTitle());
  });

  const goTo = (link?: string) => {
    if (link) {
      navigator.toByLocationType(link);
    }
  };

  return (
    <KOSPageHeader
      head={{
        title: t(title),
        subtitle: t(subtitle ?? ""),
        centerArea,
        rightArea,
      }}
      nav={{
        options: navs,
        redirectTo: goTo,
      }}
    />
  );
};

export default PageHeader;
