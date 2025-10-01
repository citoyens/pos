export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}
export interface BrandStationType {
  _id: string;
  name: string;
  slug: string;
}

export interface EnablePlatform {
  active: boolean;
}

export interface Brand {
  id: string;
  countries: string[];
  name: string;
  brandId: string;
  stationType: BrandStationType;
  platforms: Record<string, EnablePlatform>;
  logoUrl: string;
  status: Status;
  companyId: String;
}

export interface BrandSlice {
  id: string;
  name: string;
  brandId: string;
  countries: string[];
}
