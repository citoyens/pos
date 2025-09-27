import {
  KOSBaseTable,
  KOSBaseTableHeader,
  KOSRowData,
} from "@foodology-co/alejandria";
import Box from "@mui/material/Box";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import ForwardToInboxOutlinedIcon from "@mui/icons-material/ForwardToInboxOutlined";
import { FunctionComponent, useCallback, useState } from "react";
import { Actions, UserModal } from "utils/modal";
import { User } from "core/users/entities/User";
import { IconButton, Switch } from "@mui/material";
import { commons } from "app/i18n/types";
import { t } from "i18next";
import { Status } from "core/kitchens/entities/Kitchen";
import { UserRepo } from "core/users/repository/userRepo";
import { useAlert } from "app/hooks/useAlert";
import { useRole } from "app/hooks/useRole";
import { isCorporate } from "utils/areaAndPosition";
import UserChangeStatusDialog from "../ChangeStatus";
import { useAllCities } from "app/hooks/useAllCities";

interface Props {
  filteredUsers: User[];
  loading: boolean;
  setModal: (modal?: UserModal) => void;
  refreshData: () => void;
}

const UserTable: FunctionComponent<Props> = (props) => {
  const { filteredUsers, loading, setModal, refreshData } = props;

  const alert = useAlert();
  const role = useRole();
  const useCity = useAllCities();
  const isSuperUser = role.isSuperUser();

  const [reSendUserIds, setReSendUserIds] = useState<Set<string>>(new Set());
  const [userToChangeStatus, setUserToChangeStatus] = useState<KOSRowData>();

  const addUserId = (id: string) => {
    setReSendUserIds((prevSet) => new Set(prevSet).add(id));
  };

  const removeUserId = (id: string) => {
    setReSendUserIds((prevSet) => {
      const newSet = new Set(prevSet);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleResendWelcomeEmail = (id: string) => {
    addUserId(id);
    UserRepo.reSendWelcomeEmail(id)
      .then(() => {
        alert.success();
      })
      .catch((error) => {
        console.error("Error reSendWelcomeEmail", error);
        alert.error();
      })
      .finally(() => removeUserId(id));
  };

  const getActions = useCallback(
    (row: KOSRowData) => ({
      value: (
        <>
          <IconButton
            color="warning"
            onClick={() =>
              setModal({
                open: true,
                item: {
                  id: row["id"],
                },
                action: Actions.edit,
                onClose: () => setModal(undefined),
              })
            }
          >
            <ModeEditOutlineOutlinedIcon />
          </IconButton>
          <IconButton
            color="info"
            disabled={reSendUserIds.has(row.id)}
            onClick={() => handleResendWelcomeEmail(row.id)}
          >
            <ForwardToInboxOutlinedIcon />
          </IconButton>
          <Switch
            checked={row.status === Status.ACTIVE}
            onChange={() => setUserToChangeStatus(row)}
            color="primary"
          />
        </>
      ),
    }),
    [reSendUserIds]
  );

  const getHeader = useCallback((): KOSBaseTableHeader[] => {
    return [
      {
        label: t(commons.ACTION),
        align: "center",
        show: isSuperUser,
        render: getActions,
      },
      {
        label: t(commons.DOCUMENT_NUMBER),
        render: (row) => {
          const type = row.profile?.documentType;
          const typeLabel = type ? ` (${type})` : "";
          const nro = row.profile?.documentNumber;
          return { value: `${nro}${typeLabel}` };
        },
      },
      {
        label: t(commons.USER),
        field: "username",
      },
      {
        label: t(commons.NAME),
        field: "firstname",
      },
      {
        label: t(commons.LAST_NAME),
        field: "lastname",
      },
      {
        label: t(commons.EMAIL),
        field: "email",
      },
      {
        label: t(commons.COUNTRY),
        render: (row) => ({
          value: row.country
            ? t(`KOSLocationSelectorLocale.${row.country}`)
            : null,
        }),
      },
      {
        label: t(commons.CITY),
        render: (row) => ({
          value: useCity.byCode(row.city)?.name ?? row.city,
        }),
      },
      {
        label: t(commons.LOCATION),
        render: (row) => ({ value: row.profile?.kitchenId }),
      },
      {
        label: t(commons.AREA),
        render: (row) => ({ value: row.contract?.area }),
      },
      {
        label: t(commons.POSITION),
        render: (row) => ({ value: row.contract?.position }),
      },
      {
        label: t(commons.CORPORATE),
        render: (row) => ({
          value: t(isCorporate(row.contract.area) ? commons.YES : commons.NO),
        }),
      },
      {
        label: t(commons.ROLES),
        render: (row) => {
          const role = row.roles?.[0];
          return { value: role ? t(`KOSRoleLocale.${role}`) : null };
        },
      },
      {
        label: t(commons.CONTRACT_TYPE),
        render: (row) => {
          const contractType = row.contract?.contractType;
          const workingDay = row.contract?.workingDay;
          const contractTypeLabel = contractType ? t(contractType) : undefined;
          if (!contractTypeLabel) return undefined;
          const workingDayLabel = workingDay ? ` (${t(workingDay)})` : "";
          return { value: `${contractTypeLabel}${workingDayLabel}` };
        },
      },
      {
        label: t(commons.PHONE_NUMBER),
        render: (row) => ({ value: row.profile?.phoneNumber }),
      },
      {
        label: t(commons.BIRTHDATE),
        render: (row) => ({ value: row.profile?.birthday }),
      },
      {
        label: t(commons.GENRE),
        render: (row) => ({
          value: row.profile?.genre ? t(`commons.${row.profile?.genre}`) : null,
        }),
      },
      {
        label: t(commons.START_DATE),
        render: (row) => ({ value: row.contract?.startDate }),
        type: "date",
      },
      {
        label: t(commons.START_DATE_CURRENT),
        render: (row) => ({ value: row.contract?.startDateCurrent }),
        type: "date",
      },
      {
        label: t(commons.END_DATE),
        render: (row) => ({ value: row.contract?.termination?.date }),
        type: "date",
      },
      {
        label: t(commons.RETIREMENT_TYPE),
        render: (row) => ({
          value: row.contract?.termination?.type
            ? t(`retirementTypeLocale.${row.contract.termination.type}`)
            : undefined,
        }),
      },
      {
        label: t(commons.RETIREMENT_REASON),
        render: (row) => ({
          value: row.contract?.termination?.reason
            ? t(`retirementReasonLocale.${row.contract.termination.reason}`)
            : null,
        }),
      },
      {
        label: t(commons.STATUS),
        render: (row) => ({ value: t(`commons.${row.status}`) }),
      },
      {
        label: "created",
        field: "createdAt",
        type: "datetime_utc",
      },
      {
        label: "Updated",
        field: "lastUpdatedAt",
        type: "datetime_utc",
      },
    ];
  }, [reSendUserIds, isSuperUser, useCity]);

  return (
    <Box mt={2}>
      <KOSBaseTable
        columns={getHeader()}
        pagination={{ enable: true }}
        rows={{
          data: filteredUsers,
          total: filteredUsers.length,
          loading: !!loading,
        }}
        fixedColumns={1}
      />
      {!!userToChangeStatus && (
        <UserChangeStatusDialog
          item={userToChangeStatus}
          onClose={() => setUserToChangeStatus(undefined)}
          onSuccess={refreshData}
          action={Actions.changeStatus}
        />
      )}
    </Box>
  );
};

export default UserTable;
