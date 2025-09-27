import { StoreRequestError, StoreRequestStatus } from "app/store/types";
import { Session } from "core/account/entities/Session";
import { User } from "core/account/entities/User";

export interface UserState {
  data: User | null;
  status: StoreRequestStatus;
  error: StoreRequestError;
}

export interface SessionState {
  data: Session | null;
  status: StoreRequestStatus;
  error: StoreRequestError;
  user: UserState;
}

export const initialState: SessionState = {
  data: null,
  status: "idle",
  error: null,
  user: {
    data: null,
    status: "idle",
    error: null,
  },
};
