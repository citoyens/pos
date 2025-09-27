import { useCallback } from "react";
import { useAppSelector } from "./useAppSelector";
import { isSuperRole, TypeOfRole } from "utils/role";
import { rolesToApproveOvertime } from "config/route";
import { kitchenPosition } from "utils/areaAndPosition";

export interface UseRole {
  isSuperUser: () => boolean;
  isNotSuperUser: () => boolean;
  canApproveOvertime: () => boolean;
  getLocationForUserSchedule: () => string | undefined;
}

export const useRole = (): UseRole => {
  const user = useAppSelector((state) => state.session.user.data);
  const role = useAppSelector((state) => state.session.user.data?.role);

  const isSuperUser = useCallback((): boolean => {
    if (!role) return false;
    return isSuperRole(role as TypeOfRole);
  }, [role]);

  const isNotSuperUser = useCallback((): boolean => {
    if (!role) return true;
    return !isSuperUser();
  }, [role, isSuperUser]);

  const canApproveOvertime = useCallback((): boolean => {
    if (!role) return false;
    const isSuperRole = isSuperUser();
    const canApprove = rolesToApproveOvertime.includes(role as TypeOfRole);
    return canApprove || isSuperRole;
  }, [role, isSuperUser]);

  const getLocationForUserSchedule = useCallback((): string | undefined => {
    if (!role) return undefined;
    if (!kitchenPosition.includes(user?.profile?.position ?? "")) {
      return undefined;
    }
    return user?.profile?.kitchenId;
  }, [user, role]);

  return {
    isSuperUser,
    isNotSuperUser,
    canApproveOvertime,
    getLocationForUserSchedule,
  };
};
