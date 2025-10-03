import { useAllCities } from "app/components/PageHeader/hooks/useAllCities";
import { useAllKitchens } from "app/components/PageHeader/hooks/useAllKitchens";
import { useAllCountries } from "app/components/PageHeader/hooks/useAllCountries";
import {
  KitchenType,
  KOSCity,
  KOSCountry,
  KOSKitchen,
  KOSLocationSelector,
} from "@foodology-co/alejandria";
import React, { memo } from "react";

interface Props {
  selected: {
    country?: string;
    city?: string;
    kitchen?: string;
  };
  onChange?: {
    country?: (country?: KOSCountry) => void;
    city?: (city?: KOSCity) => void;
    kitchen?: (kitchen?: KOSKitchen) => void;
  };
  hide?: {
    country?: boolean;
    city?: boolean;
    kitchen?: boolean;
  };
  extra?: {
    disabled?: boolean;
    size?: "small" | "medium";
    allCityOrKitchens?: boolean;
    filterType?: KitchenType;
    showHash?: boolean;
  };
}

const KitchenSelector = (props: Props) => {
  const { selected, onChange, hide, extra } = props;
  return (
    <KOSLocationSelector
      selected={selected}
      onChange={onChange}
      hide={hide}
      extra={extra}
      list={{
        country: useAllCountries().list,
        city: useAllCities().list,
        kitchen: useAllKitchens().list as KOSKitchen[],
      }}
    />
  );
};

export default memo(KitchenSelector);
