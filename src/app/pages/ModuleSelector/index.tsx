import { KOSPageBox } from "@foodology-co/alejandria";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ModuleSelectorCard from "app/components/ModuleSelector/ModuleSelectorCard";
import PageHeader from "app/components/PageHeader";
import { useAppSelector } from "app/components/PageHeader/hooks/useAppSelector";
import { useNavigator } from "app/components/PageHeader/hooks/useNavigator";
import { modulesLocale } from "app/i18n/types";
import { t } from "i18next";
import React, { FunctionComponent, useEffect, useState } from "react";
import { ObjectParams } from "utils/http";
import { Module, getModuleLink, refineModules } from "utils/module";
import { TypeOfRole } from "utils/role";
import { refineLink } from "utils/route";

interface Props {}

const ModuleSelectorPage: FunctionComponent<Props> = () => {
  const navigator = useNavigator();
  const { typeModule } = navigator.params();

  const user = useAppSelector((state) => state.session.user.data);
  const [currentModule, setCurrentModule] = useState<Module>();
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    if (user?.role) {
      setModules(refineModules(user?.role as TypeOfRole));
    }
  }, [user?.role]);

  useEffect(() => {
    setCurrentModule(modules.find((module) => module.moduleId === typeModule));
  }, [typeModule, modules]);

  useEffect(() => {
    if (typeModule) {
      navigator.toByLocationType(getModuleLink(typeModule));
    }
  }, [typeModule]);

  return (
    <KOSPageBox>
      <PageHeader
        title={t(
          currentModule?.moduleName ?? modulesLocale.SELECT_MODULE_TITLE
        )}
        subtitle={t(
          currentModule?.description ?? modulesLocale.SELECT_MODULE_SUBTITLE
        )}
      />

      <Box mt={4}>
        <Grid spacing={2} container>
          {!typeModule && (
            <>
              {modules.map((mod) => (
                <Grid xs={12} sm={3} key={mod.moduleId} item>
                  <ModuleSelectorCard
                    title={t(mod.moduleName)}
                    description={t(mod.description ?? "")}
                    link={`/modules/${mod.moduleId}`}
                  />
                </Grid>
              ))}
            </>
          )}

          {!!typeModule && (
            <>
              {currentModule?.submodules?.map((submodule, index) => (
                <React.Fragment key={submodule.moduleId}>
                  {submodule.link && (
                    <Grid
                      xs={12}
                      sm={6}
                      md={3}
                      key={`${submodule.moduleId}-${index}`}
                      item
                    >
                      <ModuleSelectorCard
                        moduleId={submodule.moduleId}
                        title={t(submodule.moduleName)}
                        description={t(submodule.description ?? "")}
                        link={refineLink(submodule.link, {
                          locationType: currentModule.locationType,
                        } as ObjectParams)}
                      />
                    </Grid>
                  )}
                </React.Fragment>
              ))}
            </>
          )}
        </Grid>
      </Box>
    </KOSPageBox>
  );
};

export default ModuleSelectorPage;
