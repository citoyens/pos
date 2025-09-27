import { useState } from "react";
import { User } from "core/users/entities/User";
import { UserRepo } from "core/users/repository/userRepo";

export interface UseAllUsers {
  get: () => void;
  list: User[];
  getLoading: boolean;
  byId: (id: string) => void;
  userById: User | undefined;
}

export const useAllUsers = (): UseAllUsers => {
  const [users, setUsers] = useState<User[]>([]);
  const [getAllLoading, setGetAllLoading] = useState<boolean>(false);
  let loading = false;

  const getAll = () => {
    if (loading) return;
    loading = true;
    setGetAllLoading(true);

    UserRepo.getAll()
      .then((response) => {
        setUsers(response);
      })
      .catch((error) => {
        setUsers([]);
      })
      .finally(() => {
        loading = false;
        setGetAllLoading(false);
      });
  };

  const [user, setUser] = useState<User>();

  const byId = (id: string) => {
    if (loading) return;
    loading = true;

    UserRepo.byId(id)
      .then((response) => {
        setUser(response);
      })
      .catch(() => {
        setUser(undefined);
      })
      .finally(() => {
        loading = false;
      });
  };

  return {
    get: getAll,
    getLoading: getAllLoading,
    list: users,
    byId,
    userById: user,
  };
};
