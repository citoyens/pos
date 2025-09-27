import { commons, permissionsByRole } from "app/i18n/types";
import { TFunction } from "i18next";
import { CancelOutlined, TaskAlt } from "@mui/icons-material";
import { KOSSelectedResult } from "@foodology-co/alejandria";

export enum Actions {
  add = "ADD",
  edit = "EDIT",
  view = "VIEW",
  config = "CONFIG",
  summary = "SUMMARY",
  changeStatus = "CHANGE_STATUS",
  changeAccess = "CHANGE_ACCESS",
}

export const actionWithInformation = [
  Actions.edit,
  Actions.config,
  Actions.summary,
  Actions.view,
];

export const getIsLoading = (
  action: Actions | undefined,
  information: boolean
): boolean => {
  return actionWithInformation.includes(action ?? Actions.add)
    ? !information
    : false;
};

export interface BaseModal {
  open?: boolean;
  onClose: () => void;
  title?: string;
  action?: Actions;
}

export interface StoreModal extends BaseModal {
  item?: KOSSelectedResult;
}

export interface BrandModal extends BaseModal {
  item?: KOSSelectedResult;
}

export interface KitchenModal extends BaseModal {
  item?: KOSSelectedResult;
}

export interface UserModal extends BaseModal {
  item?: KOSSelectedResult;
}

export interface ShiftModal extends BaseModal {
  item?: KOSSelectedResult;
}
export interface RoleModal extends BaseModal {
  item?: KOSSelectedResult;
}

export const getDialogTitle = (
  t: TFunction,
  title?: string,
  action?: Actions
) => {
  const options = {
    [Actions.add]: t(commons.ADD),
    [Actions.edit]: t(commons.MODIFY),
    [Actions.view]: t(commons.VIEW_DETAIL),
    [Actions.config]: t(commons.SET_UP),
    [Actions.summary]: t(commons.SUMMARY),
    [Actions.changeStatus]: t(commons.CHANGE_STATUS),
    [Actions.changeAccess]: t(permissionsByRole.TITLE),
  };

  return title ? t(title) : options[action ?? Actions.add];
};

export const handleModalIcon = (isError: boolean) => {
  if (isError) {
    return <CancelOutlined color="warning" />;
  }
  return <TaskAlt color="success" />;
};

export const addOrEditModal = (modal?: RoleModal) => {
  return (
    modal &&
    modal.open &&
    modal.action &&
    [Actions.add, Actions.edit].includes(modal.action)
  );
};

export const changeAccessModal = (modal?: RoleModal) => {
  return (
    modal &&
    modal.open &&
    modal.action &&
    [Actions.changeAccess].includes(modal.action)
  );
};
