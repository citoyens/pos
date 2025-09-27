import { Role } from "core/Roles/entities/Role";
import { RoleRepo } from "core/Roles/repository/roleRepo";
import { useState } from "react";

export interface UseAllRoles {
  get: () => void;
  list: Role[];
  getLoading: boolean;
}

export const useAllRoles = (): UseAllRoles => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [getAllLoading, setGetAllLoading] = useState<boolean>(false);
  let loading = false;

  const getAll = () => {
    if (loading) return;
    loading = true;
    setGetAllLoading(true);

    RoleRepo.all()
      .then((response) => setRoles(response))
      .catch(() => setRoles([]))
      .finally(() => {
        loading = false;
        setGetAllLoading(false);
      });
  };

  return {
    get: getAll,
    getLoading: getAllLoading,
    list: roles,
  };
};
