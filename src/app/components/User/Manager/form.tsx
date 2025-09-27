import {
  FormControl,
  Grid,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  LinearProgress,
  Divider,
} from "@mui/material";
import { ManagerDialogFooter } from "app/components/common/Manager/Dialog/Footer";
import { useAlert } from "app/hooks/useAlert";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseDialogProps, FormState, handleValidations } from "./utils";
import { UserRepo } from "core/users/repository/userRepo";
import { Actions, handleModalIcon } from "utils/modal";
import {
  User,
  Genre,
  mapUserToNewUserPayload,
  Role,
  ContractType,
  WorkingDay,
} from "core/users/entities/User";
import { useModal } from "app/hooks/useModal";
import { commons } from "app/i18n/types";
import KitchenSelector from "app/components/Kitchen/Selector";
import CustomSelector from "app/components/common/Selector";
import { getDocumentTypes } from "utils/documentType";
import { useAppSelector } from "app/hooks/useAppSelector";
import { getAreas, getPositions } from "utils/areaAndPosition";

interface Props extends BaseDialogProps {
  item?: User;
}

export const HandleUserForm = (props: Props) => {
  const { item: initialValues, onClose, onSuccess, action } = props;
  const { t } = useTranslation();
  const modal = useModal();
  const alert = useAlert();
  const companyCode = useAppSelector((state) => state.session.data?.companyId);

  const [loadingSelectLocation, setLoadingSelectLocation] =
    useState<boolean>(false);

  const getInitialValues = useCallback((): FormState => {
    setLoadingSelectLocation(true);
    setTimeout(() => {
      setFormState((prev) => ({
        ...prev,
        city: initialValues?.city,
      }));
      setTimeout(() => {
        setFormState((prev) => ({
          ...prev,
          profile: initialValues?.profile
            ? {
                ...(initialValues.profile ?? {}),
                kitchenId: initialValues.profile.kitchenId,
              }
            : undefined,
        }));
        setLoadingSelectLocation(false);
      }, 200);
    }, 200);

    return {
      ...initialValues,
      city: undefined,
      profile: {
        ...initialValues?.profile,
        kitchenId: "",
      },
      contract: {
        ...initialValues?.contract,
        startDateCurrent:
          initialValues?.contract?.startDateCurrent ??
          initialValues?.contract.startDate,
      },
    } as FormState;
  }, [initialValues]);

  const toFormState = (): FormState => {
    const currentDate = new Date().toISOString().split("T")[0];
    return action === Actions.edit
      ? getInitialValues()
      : {
          firstname: "",
          lastname: "",
          country: "",
          city: "",
          profile: {
            birthday: "",
            documentNumber: "",
            documentType: "",
            genre: Genre.MALE,
            kitchenId: "",
            phoneNumber: "",
          },
          contract: {
            area: "",
            position: "",
            contractType: ContractType.DIRECT,
            workingDay: WorkingDay.FULL,
            costCenter: "",
            startDate: currentDate,
            startDateCurrent: currentDate,
          },
          roles: [],
        };
  };

  const [areas, setAreas] = useState<string[]>();
  const [positions, setPositions] = useState<string[]>();
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [formState, setFormState] = useState<FormState>(() => toFormState());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setAreas(undefined);
    setDocumentTypes([]);
    if (!companyCode) return;
    if (!formState.country) return;
    setDocumentTypes(getDocumentTypes(companyCode, formState.country));
    setAreas(getAreas(companyCode, formState.country));
  }, [companyCode, formState.country]);

  useEffect(() => {
    setPositions(undefined);
    if (!formState.contract?.area) return;
    setPositions(getPositions(formState.contract?.area));
  }, [formState.contract?.area]);

  useEffect(() => {
    setFormState(() => toFormState());
  }, [initialValues]);

  useEffect(() => {
    if (loadingSelectLocation) return;
    modal.validator(handleValidations, {
      ...formState,
      ...(formState.profile ?? {}),
      ...(formState.contract ?? {}),
    });
  }, [formState]);

  const handleSubmit = useCallback(() => {
    if (
      !handleValidations.isValidSync({
        ...formState,
        ...(formState.profile ?? {}),
        ...(formState.contract ?? {}),
      })
    ) {
      return;
    }

    setIsLoading(true);

    if (action === Actions.edit) {
      UserRepo.update(formState)
        .then((response) => {
          alert.success();
          onSuccess();
          onClose();
        })
        .catch(() => {
          alert.error();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (action === Actions.add) {
      const newUser = mapUserToNewUserPayload(formState);
      UserRepo.create(newUser)
        .then((result) => {
          if (!result.success) {
            alert.warningWithMsg({
              title: t(`userManager.${result.errorCode}`),
            });
            return;
          }
          alert.success();
          onSuccess();
          onClose();
        })
        .catch(() => {
          alert.error();
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [formState]);

  function trimAndCapitalize(value: string): string {
    const words = value.trim().split(/\s+/);
    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  return (
    <Grid container spacing={3}>
      {isLoading && (
        <Grid item xs={12}>
          <LinearProgress />
        </Grid>
      )}
      <Grid item xs={12}>
        <KitchenSelector
          selected={{
            country: formState.country,
            city: formState.city,
            kitchen: formState.profile?.kitchenId,
          }}
          onChange={{
            country: (country) =>
              setFormState((prev) => ({
                ...prev,
                country: country?.code,
              })),
            city: (city) => {
              setFormState((prev) => ({
                ...prev,
                city: city?.code,
              }));
            },
            kitchen: (kitchen) =>
              setFormState((prev) => ({
                ...prev,
                profile: prev.profile
                  ? {
                      ...prev.profile,
                      kitchenId: kitchen?.kitchenId ?? "",
                    }
                  : undefined,
              })),
          }}
          extra={{ disabled: loadingSelectLocation }}
        />
      </Grid>
      <Grid item xs={6}>
        <CustomSelector
          label={t(commons.DOCUMENT_TYPE)}
          options={documentTypes}
          selected={formState.profile?.documentType}
          endAdornment={handleModalIcon(modal.errors["documentType"])}
          setSelected={(newValue) =>
            setFormState((prev) => ({
              ...prev,
              profile: prev.profile
                ? { ...prev.profile, documentType: newValue ?? "" }
                : undefined,
            }))
          }
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label={t(commons.DOCUMENT_NUMBER)}
          InputProps={{
            endAdornment: handleModalIcon(modal.errors["documentNumber"]),
          }}
          value={formState.profile?.documentNumber}
          onChange={(e) => {
            const newValue = e.target.value;
            setFormState((prev) => ({
              ...prev,
              username: newValue,
              profile: prev.profile
                ? { ...prev.profile, documentNumber: newValue }
                : undefined,
            }));
          }}
          focused={!!formState.profile?.documentNumber}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label={t(commons.NAME)}
          value={formState.firstname}
          InputProps={{
            endAdornment: handleModalIcon(modal.errors["firstname"]),
          }}
          onChange={(e) =>
            setFormState({ ...formState, firstname: e.target.value })
          }
          onBlur={(e) =>
            setFormState((prev) => ({
              ...prev,
              firstname: trimAndCapitalize(e.target.value),
            }))
          }
          focused={!!formState.firstname}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label={t(commons.LAST_NAME)}
          value={formState.lastname}
          InputProps={{
            endAdornment: handleModalIcon(modal.errors["lastname"]),
          }}
          onChange={(e) =>
            setFormState({ ...formState, lastname: e.target.value })
          }
          onBlur={(e) =>
            setFormState((prev) => ({
              ...prev,
              lastname: trimAndCapitalize(e.target.value),
            }))
          }
          focused={!!formState.lastname}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label={t(commons.USER_NAME)}
          value={formState.username}
          InputProps={{
            endAdornment: handleModalIcon(modal.errors["username"]),
          }}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, username: e.target.value }))
          }
          focused={!!formState.username}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label={t(commons.EMAIL)}
          type="email"
          value={formState.email}
          InputProps={{
            endAdornment: handleModalIcon(modal.errors["email"]),
          }}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              email: e.target.value.toLowerCase(),
            }))
          }
          focused={!!formState.email}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          fullWidth
          label={t(commons.BIRTHDATE)}
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            endAdornment: handleModalIcon(modal.errors["birthday"]),
          }}
          value={formState.profile?.birthday ?? ""}
          onChange={(e) => {
            const newDate = e.target.value;
            setFormState((prev) => ({
              ...prev,
              profile: prev.profile
                ? {
                    ...prev.profile,
                    birthday: newDate,
                  }
                : undefined,
            }));
          }}
          focused={!!formState.profile?.birthday}
        />
      </Grid>
      <Grid item xs={4}>
        <FormControl fullWidth>
          <InputLabel>{t(commons.GENRE)}</InputLabel>
          <Select
            fullWidth
            label={t(commons.GENRE)}
            value={formState.profile?.genre ?? ""}
            endAdornment={handleModalIcon(modal.errors["genre"])}
            onChange={(e) =>
              setFormState({
                ...formState,
                profile: formState.profile
                  ? {
                      ...formState.profile,
                      genre: e.target.value as Genre,
                    }
                  : undefined,
              })
            }
          >
            {Object.keys(Genre).map((key) => (
              <MenuItem value={key}>{t(`commons.${key}`)}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <TextField
          fullWidth
          label={t(commons.PHONE_NUMBER)}
          value={formState.profile?.phoneNumber}
          InputProps={{
            endAdornment: handleModalIcon(modal.errors["phoneNumber"]),
          }}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              profile: prev.profile
                ? { ...prev.profile, phoneNumber: e.target.value }
                : undefined,
            }))
          }
          focused={!!formState.profile?.phoneNumber}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <CustomSelector
            label={t(commons.ROLES)}
            optionPrefix="KOSRoleLocale"
            options={Object.values(Role).sort((a, b) => a.localeCompare(b))}
            endAdornment={handleModalIcon(modal.errors["roles"])}
            selected={formState.roles?.join("|") || undefined}
            setSelected={(items?: string) =>
              setFormState({
                ...formState,
                roles: items?.split("|"),
              })
            }
          />
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={6}>
        {!!areas && (
          <CustomSelector
            label={t(commons.AREA)}
            options={areas}
            selected={formState.contract?.area}
            disabled={!formState.country}
            endAdornment={handleModalIcon(modal.errors["area"])}
            setSelected={(newValue) =>
              setFormState({
                ...formState,
                contract: formState.contract
                  ? {
                      ...formState.contract,
                      area: newValue ?? "",
                      position: "",
                    }
                  : undefined,
              })
            }
          />
        )}
        {!areas && (
          <TextField
            fullWidth
            label={t(commons.AREA)}
            disabled={!formState.country}
            value={formState.contract?.area}
            InputProps={{
              endAdornment: handleModalIcon(modal.errors["area"]),
            }}
            onChange={(e) =>
              setFormState({
                ...formState,
                contract: formState.contract
                  ? {
                      ...formState.contract,
                      area: e.target.value.toUpperCase(),
                    }
                  : undefined,
              })
            }
            focused={!!formState.contract?.area}
          />
        )}
      </Grid>
      <Grid item xs={6}>
        {!!positions && (
          <CustomSelector
            label={t(commons.POSITION)}
            options={positions}
            disabled={!formState.contract?.area}
            selected={formState.contract?.position}
            endAdornment={handleModalIcon(modal.errors["position"])}
            setSelected={(newValue) =>
              setFormState({
                ...formState,
                contract: formState.contract
                  ? {
                      ...formState.contract,
                      position: newValue ?? "",
                    }
                  : undefined,
              })
            }
          />
        )}
        {!positions && (
          <TextField
            fullWidth
            label={t(commons.POSITION)}
            value={formState.contract?.position}
            disabled={!formState.contract?.area}
            InputProps={{
              endAdornment: handleModalIcon(modal.errors["position"]),
            }}
            onChange={(e) =>
              setFormState({
                ...formState,
                contract: formState.contract
                  ? {
                      ...formState.contract,
                      position: e.target.value.toUpperCase(),
                    }
                  : undefined,
              })
            }
            focused={!!formState.contract?.position}
          />
        )}
      </Grid>
      <Grid item xs={3}>
        <FormControl fullWidth>
          <InputLabel>{t(commons.CONTRACT_TYPE)}</InputLabel>
          <Select
            fullWidth
            label={t(commons.CONTRACT_TYPE)}
            value={
              formState.contract?.contractType
                ? (formState.contract?.contractType as string)
                : null
            }
            endAdornment={handleModalIcon(modal.errors["contractType"])}
            onChange={(e) =>
              setFormState({
                ...formState,
                contract: formState.contract
                  ? {
                      ...formState.contract,
                      contractType: e.target.value as ContractType,
                    }
                  : undefined,
              })
            }
          >
            {Object.keys(ContractType).map((key) => (
              <MenuItem value={key}>{t(key)}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <FormControl fullWidth>
          <InputLabel>{t(commons.WORKING_DAY)}</InputLabel>
          <Select
            fullWidth
            label={t(commons.WORKING_DAY)}
            value={
              formState.contract?.workingDay
                ? (formState.contract?.workingDay as string)
                : null
            }
            endAdornment={handleModalIcon(modal.errors["workingDay"])}
            onChange={(e) =>
              setFormState({
                ...formState,
                contract: formState.contract
                  ? {
                      ...formState.contract,
                      workingDay: e.target.value as WorkingDay,
                    }
                  : undefined,
              })
            }
          >
            {Object.keys(WorkingDay).map((key) => (
              <MenuItem value={key}>{t(key)}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={5}>
        <TextField
          fullWidth
          label={t(commons.COST_CENTER)}
          value={formState.contract?.costCenter}
          onChange={(e) =>
            setFormState({
              ...formState,
              contract: formState.contract
                ? {
                    ...formState.contract,
                    costCenter: e.target.value.toUpperCase(),
                  }
                : undefined,
            })
          }
          focused={!!formState.contract?.costCenter}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label={t(commons.START_DATE)}
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            endAdornment: handleModalIcon(modal.errors["startDate"]),
          }}
          value={formState.contract?.startDate ?? ""}
          onChange={(e) => {
            const newDate = e.target.value;
            setFormState((prev) => ({
              ...prev,
              contract: prev.contract
                ? {
                    ...prev.contract,
                    startDate: newDate,
                    startDateCurrent: newDate,
                  }
                : undefined,
            }));
          }}
          disabled={action !== Actions.add && !!formState.contract?.startDate}
          focused={!!formState.contract?.startDate}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label={t(commons.START_DATE_CURRENT)}
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            endAdornment: handleModalIcon(modal.errors["startDateCurrent"]),
          }}
          value={formState.contract?.startDateCurrent ?? ""}
          onChange={(e) => {
            const newDate = e.target.value;
            setFormState((prev) => ({
              ...prev,
              contract: prev.contract
                ? {
                    ...prev.contract,
                    startDateCurrent: newDate,
                  }
                : undefined,
            }));
          }}
          focused={!!formState.contract?.startDateCurrent}
        />
      </Grid>
      <Grid item xs={12}>
        <ManagerDialogFooter
          onCancel={props.onClose}
          mainButton={{
            children: t(commons.SAVE),
            onClick: handleSubmit,
            disabled: isLoading || !!Object.keys(modal.errors).length,
          }}
        />
      </Grid>
    </Grid>
  );
};
