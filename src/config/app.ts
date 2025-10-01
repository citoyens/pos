interface ModuleConfig {
  url: string;
  apiBaseUrl: string;
}

export interface Firebase {
  apiKey: string;
  appId: string;
  authDomain: string;
  messagingSenderId: string;
  projectId: string;
  storageBucket: string;
  vapidKey: string;
}

export interface AppConfig {
  env: string;
  kitchenDisplay: ModuleConfig;
  bistroKeeper: ModuleConfig;
  avatar: ModuleConfig;
  foodologyPos: ModuleConfig;
}

const appConfig: AppConfig = {
  env: process.env.REACT_APP_ENV ?? "development",
  kitchenDisplay: {
    url: process.env.REACT_APP_KITCHEN_DISPLAY_URL ?? "",
    apiBaseUrl: "",
  },
  bistroKeeper: {
    url: process.env.REACT_APP_BISTRO_KEEPER_URL ?? "",
    apiBaseUrl: process.env.REACT_APP_BISTRO_KEEPER_API_BASE_URL ?? "",
  },
  avatar: {
    url: process.env.REACT_APP_AVATAR_URL ?? "",
    apiBaseUrl: process.env.REACT_APP_AVATAR_API_BASE_URL ?? "",
  },
  foodologyPos: {
    url: "",
    apiBaseUrl: process.env.REACT_APP_FOODOLOGY_POS_API_BASE_URL ?? "",
  },
};

export default appConfig;
