import { useAppDispatch } from "app/components/PageHeader/hooks/useAppDispatch";
import { useAppSelector } from "app/components/PageHeader/hooks/useAppSelector";
import { useNavigator } from "app/components/PageHeader/hooks/useNavigator";
import { commons } from "app/i18n/types";
import { getSession, getUser } from "app/store/slices/session/thunks";
import { t } from "i18next";
import React, { useEffect } from "react";
import { useMount } from "react-use";
import { getSession as getSessionUtils } from "utils/session";

interface ProtectedRoute {
  children: React.ReactNode;
}

const ProtectedRoutes = (props: ProtectedRoute) => {
  const { children } = props;

  const navigator = useNavigator();
  const pathname = navigator.location();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.session.user.data);
  const userStatus = useAppSelector((state) => state.session.user.status);
  const sessionStatus = useAppSelector((state) => state.session.status);

  useEffect(() => {
    getSessionUtils();
  }, [pathname]);

  useMount(() => {
    dispatch(getUser());
    dispatch(getSession());
  });

  return (
    <>
      {sessionStatus === "loading" &&
        userStatus === "loading" &&
        t(commons.LOADING)}
      {sessionStatus === "succeeded" && userStatus === "succeeded" && children}
    </>
  );
};

export default ProtectedRoutes;
