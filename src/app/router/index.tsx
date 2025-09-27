import { KOSEnvironment, KOSFavIcon } from "@foodology-co/alejandria";
import AppLayout from "app/components/AppLayout";
import ProtectedRoutes from "app/components/ProtectedRoutes/ProtectedRoutes";
import { useAppSelector } from "app/hooks/useAppSelector";
import ErrorPage from "app/pages/Error";
import LoadingPage from "app/pages/Loading";
import appConfig from "config/app";
import React, { FunctionComponent } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TypeOfRole } from "utils/role";
import { customRoutes } from "utils/route";

interface RouterProps {}

const Router: FunctionComponent<RouterProps> = (): React.JSX.Element => {
  const user = useAppSelector((state) => state.session.user.data);
  const session = useAppSelector((state) => state.session.data);
  const role = user?.role as TypeOfRole;

  const routesToRender: React.ReactElement[] = [];

  if (role) {
    customRoutes(routesToRender, role);
  }

  return (
    <BrowserRouter>
      {session && (
        <KOSFavIcon
          environment={appConfig.env as KOSEnvironment}
          companyId={session.companyId}
        />
      )}
      <ProtectedRoutes>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            {routesToRender}
          </Route>
          <Route path="*" element={role ? <ErrorPage /> : <LoadingPage />} />
        </Routes>
      </ProtectedRoutes>
    </BrowserRouter>
  );
};

export default Router;
