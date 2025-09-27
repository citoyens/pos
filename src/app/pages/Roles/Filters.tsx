import { FunctionComponent, useEffect, useState } from "react";
import SearchOnTopBar from "app/components/common/SearchOnTopBar";
import { compareSearchText } from "utils/general";
import { Role } from "core/Roles/entities/Role";

interface Props {
  roles: Role[];
  setFilteredRoles: (roles: Role[]) => void;
}

const RoleFilter: FunctionComponent<Props> = ({ roles, setFilteredRoles }) => {
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    setFilteredRoles(
      roles.filter((role) => {
        const matchSearch =
          !search ||
          compareSearchText(role.name, search) ||
          compareSearchText(role.id, search);
        return matchSearch;
      })
    );
  }, [roles, search, setFilteredRoles]);

  return <SearchOnTopBar onSearch={setSearch} />;
};

export default RoleFilter;
