export interface Country {
  code: string;
  paymentCurrency: string;
  zone: string;
  domain: string;
}

export interface CountryResponse {
  data: Country[];
}
