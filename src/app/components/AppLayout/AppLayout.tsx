import { KOSMenu } from "@foodology-co/alejandria";
import { Alert, AlertTitle, Snackbar } from "@mui/material";
import Box from "@mui/material/Box";
import { useAppDispatch } from "app/hooks/useAppDispatch";
import { useAppSelector } from "app/hooks/useAppSelector";
import { useNavigator } from "app/hooks/useNavigator";
import { hideAlert } from "app/store/slices/global";
import { getUserMenu } from "app/store/slices/menu/thunks";
import appConfig from "config/app";
import { FunctionComponent, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useMount } from "react-use";
import TopBar from "../TopBar";
import { useAllCountries } from "app/hooks/useAllCountries";
import { useAllKitchens } from "app/hooks/useAllKitchens";
import { useAllCities } from "app/hooks/useAllCities";
import { useTranslation } from "react-i18next";
import textToSpeech from "utils/textToSpeech";
import { useCompany } from "app/hooks/useCompany";

interface AppLayoutProps {}

const AppLayout: FunctionComponent<AppLayoutProps> = () => {
  const navigator = useNavigator();
  const dispatch = useAppDispatch();
  const allCountries = useAllCountries();
  const allKitchens = useAllKitchens();
  const allCities = useAllCities();
  const company = useCompany();

  const menuOpen = useAppSelector((state) => state.menu.open);
  const menu = useAppSelector((state) => state.menu.items);
  const user = useAppSelector((state) => state.session.user.data);
  const { t } = useTranslation();

  const alert = useAppSelector((state) => state.global.alert);

  const hideAppAlert = () => dispatch(hideAlert());

  const handleCloseAlert = () => {
    if (hideAppAlert) {
      hideAppAlert();
    }
  };

  const onClickMenuItem = (to: string | undefined) => {
    const path = to!!;
    if (to!!.includes("http")) {
      window.location.href = path;
    } else if (path) {
      navigator.to(path);
    }
  };

  useMount(() => {
    dispatch(getUserMenu());
    company.get();
    allCountries.get();
    allKitchens.get();
    allCities.get();
  });

  useEffect(() => {
    const { title, message, audioOn } = alert;
    const text: string[] = [];
    if (title) text.push(title);
    if (message) text.push(message);
    if (text.length && audioOn) {
      textToSpeech(text.join("   "), 600);
    }
  }, [alert]);

  return (
    <Box display="flex" pt={7}>
      <Snackbar
        open={alert.show}
        onClose={handleCloseAlert}
        autoHideDuration={alert.duration}
        anchorOrigin={alert.position}
      >
        <Alert
          variant="filled"
          severity={alert.severity}
          sx={{ minWidth: 360 }}
          onClose={handleCloseAlert}
          icon={alert.icon}
        >
          <AlertTitle>{alert.title}</AlertTitle>
          {alert.message}
          <Box>{alert.action}</Box>
        </Alert>
      </Snackbar>

      <TopBar />

      <KOSMenu
        user={
          user
            ? { ...user, rolName: t(`KOSRoleLocale.${user.role}`) }
            : undefined
        }
        drawerOpen={menuOpen}
        items={menu}
        onClickMenuItem={onClickMenuItem}
        homeUrl={`${appConfig.kitchenDisplay.url}/home`}
        sx={{ zIndex: 14 }}
      />

      <Box flexGrow={1} minHeight="calc(100vh - 56px)" overflow="auto">
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
