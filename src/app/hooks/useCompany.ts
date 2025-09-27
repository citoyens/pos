import { setCompany } from "app/store/slices/global";
import { Company } from "core/company/entities/Company";
import { CompanyRepo } from "core/company/repository/companyRepo";
import { useCallback } from "react";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";

export enum ConfigCode {
  requireAttachmentAtReception = "requireAttachmentAtReception",
  productionReason = "productionReason",
  showPicesInPurchaseOrderReception = "showPicesInPurchaseOrderReception",
  reviewPickingItemsWhenCreatingLabels = "reviewPickingItemsWhenCreatingLabels",
}

export interface UseCompany {
  get: () => void;
  config: (key: ConfigCode) => any;
  data?: Company;
}

export const useCompany = (): UseCompany => {
  const company = useAppSelector((state) => state.global.company);
  const session = useAppSelector((state) => state.session.data);
  const dispatch = useAppDispatch();
  let loading = false;

  const byCode = () => {
    if (["loading"].includes(company.status)) return;
    if (loading) return;
    loading = true;

    dispatch(setCompany({ ...company, status: "loading" }));

    const code = session?.companyId;

    if (!code) {
      dispatch(
        setCompany({
          ...company,
          status: "failed",
          error: "company code is null",
        })
      );
      return;
    }

    CompanyRepo.byCode(code)
      .then((response) => {
        dispatch(
          setCompany({
            ...company,
            status: "succeeded",
            data: response,
          })
        );
      })
      .catch((error) => {
        dispatch(setCompany({ ...company, status: "failed", error }));
      })
      .finally(() => {
        loading = false;
      });
  };

  const config = useCallback(
    (key: ConfigCode) => {
      return company.data?.configs?.[key]?.value;
    },
    [company.data]
  );

  return {
    get: byCode,
    config,
    data: company.data,
  };
};
