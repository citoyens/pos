export interface LocaleData {
  locale: string;
  currencyCode: string;
}

interface LocateCountryData {
  [key: string]: LocaleData;
}

export const localeData: LocateCountryData = {
  MEX: { locale: "es-MX", currencyCode: "MXN" },
  COL: { locale: "es-CO", currencyCode: "COP" },
  PER: { locale: "es-PE", currencyCode: "PEN" },
  BRA: { locale: "pt-BR", currencyCode: "BRL" },
  ECU: { locale: "es-EC", currencyCode: "USD" },
};

export const formatPrice = (
  amout: number,
  localeData: LocaleData,
  decimals: number = 2
) => {
  const formatter = Intl.NumberFormat(localeData.locale, {
    style: "currency",
    currency: localeData.currencyCode,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return formatter.format(amout);
};

/*
 * Example: formatPrice(10000, currencyLocale.COL)
 */
