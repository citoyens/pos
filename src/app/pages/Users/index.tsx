import { KOSPageBox } from "@foodology-co/alejandria";
import { commons, userManager } from "app/i18n/types";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { FunctionComponent, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Actions, UserModal } from "utils/modal";
import { User } from "core/users/entities/User";
import UserTable from "app/components/User/Table";
import UserFilter from "./Filters";
import UserManagerDialog from "app/components/User/Manager";
import PageHeader from "app/components/PageHeader";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import { useAllUsers } from "app/hooks/useAllUsers";
import { useMount } from "react-use";
import { useRole } from "app/hooks/useRole";
import { downloadTextAsCsv, json2Csv } from "core/common/utils/fileUtils";
import { sortUserToCSV, userToCSV } from "utils/user";
import { useAllCities } from "app/hooks/useAllCities";

interface Props {}

const UserPage: FunctionComponent<Props> = () => {
  const { t } = useTranslation();

  const users = useAllUsers();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [modal, setModal] = useState<UserModal>();
  const [loadingExport, setLoadingExport] = useState<boolean>(false);

  const role = useRole();
  const isSuperUser = role.isSuperUser();
  const useCity = useAllCities();

  const getData = () => {
    users.get();
  };

  const onCloseModal = () => setModal(undefined);

  const getCSV = useCallback(() => {
    setLoadingExport(true);
    try {
      const data = users.list.map((el) => userToCSV(el, useCity, t));
      data.sort(sortUserToCSV);
      downloadTextAsCsv(
        json2Csv(data),
        `${t(userManager.USERS)} ${new Date().getTime()}.csv`
      );
    } catch (error) {
      console.error("Error in getCSV", error);
    }
    setLoadingExport(false);
  }, [users.list, useCity]);

  useMount(() => {
    getData();
  });

  return (
    <KOSPageBox>
      <PageHeader
        title={userManager.TITLE}
        rightArea={[
          {
            children: t(commons.CREATE),
            variant: "contained",
            startIcon: <AddOutlinedIcon />,
            show: isSuperUser,
            onClick: () =>
              setModal({
                open: true,
                action: Actions.add,
                onClose: onCloseModal,
              }),
          },
          {
            children: t(commons.EXPORT),
            variant: "outlined",
            color: "info",
            onClick: getCSV,
            disabled: loadingExport,
            startIcon: <FileDownloadOutlinedIcon />,
          },
          {
            children: t(commons.UPDATE),
            variant: "outlined",
            startIcon: <RestartAltOutlinedIcon />,
            onClick: getData,
          },
        ]}
      />
      <UserFilter
        users={users.list}
        setFilteredStores={setFilteredUsers}
        loading={users.getLoading}
      />

      <UserTable
        filteredUsers={filteredUsers}
        loading={users.getLoading}
        setModal={setModal}
        refreshData={getData}
      />

      {isSuperUser && modal?.open && (
        <UserManagerDialog
          {...modal}
          onClose={onCloseModal}
          onSuccess={getData}
        />
      )}
    </KOSPageBox>
  );
};

export default UserPage;
