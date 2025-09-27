export interface Session {
  userId: string;
  token: string;
  companyId: string;
  authorization: string;
}

export const emptySession = {
  userId: "",
  token: "",
  companyId: "",
  authorization: "",
};
