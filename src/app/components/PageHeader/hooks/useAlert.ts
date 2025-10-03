import { AlertColor } from "@mui/material";
import { dequeueAlert, queueAlert, showAlert } from "app/store/slices/global";
import { Alert } from "app/store/slices/global/state";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "./useAppDispatch";
import { alertMessage } from "app/i18n/types";
import { useEffect, useRef } from "react";
import { useAppSelector } from "./useAppSelector";

export const alert: Alert = {
  duration: 5000,
  audioOn: false,
  position: {
    vertical: "top",
    horizontal: "right",
  },
};

export interface Msg {
  title: string;
  message?: string;
  audioOn?: boolean;
}

interface UseAlert {
  success: () => void;
  error: () => void;
  successWithMsg: (msg: Msg) => void;
  errorWithMsg: (msg: Msg) => void;
  warningWithMsg: (msg: Msg) => void;
}

export const useAlert = (): UseAlert => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const dequeue = () => dispatch(dequeueAlert());
  const addQueue = (alert: Alert) => dispatch(queueAlert(alert));
  const showAppAlert = (alert: Alert) => dispatch(showAlert(alert));

  const currentAlert = useAppSelector((state) => state.global.alert);
  const queue = useAppSelector((state) => state.global.alerts);
  const isProcessing = useRef(false);

  useEffect(() => {
    if (queue.length === 0 || isProcessing.current) return;

    isProcessing.current = true;

    const processNext = async () => {
      const current = queue[0];
      showAppAlert(current);
    };

    processNext();
  }, [queue]);

  useEffect(() => {
    if (currentAlert.show === false && isProcessing.current) {
      dequeue();
      isProcessing.current = false;
    }
  }, [currentAlert.show]);

  const defaultAlert = (props: Partial<Alert>) =>
    addQueue({ ...alert, ...props });

  const alertWithMsg = (msg: Msg, severity: AlertColor) => {
    const props: Partial<Alert> = {
      title: t(msg.title),
      message: msg.message ? t(msg.message) : undefined,
      audioOn: !msg.audioOn ? alert.audioOn : msg.audioOn,
    };
    addQueue({ ...alert, ...props, severity });
  };

  return {
    success: () =>
      defaultAlert({
        title: t(alertMessage.SUCCESSFUL_PROCESS),
        severity: "success",
      }),
    error: () =>
      defaultAlert({
        title: t(alertMessage.FAILED_PROCESS),
        severity: "error",
      }),
    successWithMsg: (msg: Msg) => alertWithMsg(msg, "success"),
    errorWithMsg: (msg: Msg) => alertWithMsg(msg, "error"),
    warningWithMsg: (msg: Msg) => alertWithMsg(msg, "warning"),
  };
};
