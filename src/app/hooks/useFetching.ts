import { useEffect } from "react";
import { useAppDispatch } from "./useAppDispatch";

export const useFetching = (someFetchActionCreator: any) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(someFetchActionCreator());
  }, [dispatch, someFetchActionCreator]);
};
