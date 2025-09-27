export interface UserProfile {
  firstName: string;
  lastName: string;
  name: string;
  position: string;
  identification: string;
  country: string;
  kitchenId: string;
}

export interface User {
  _id: string;
  username: string;
  profile: UserProfile;
  role: string;
  profileImage: string;
}

export const emptyUser = {
  _id: "",
  username: "",
  profile: {
    firstName: "",
    lastName: "",
    name: "",
    position: "",
    identification: "",
    country: "",
    kitchenId: "",
  },
  role: "",
  profileImage: "",
  roleName: "",
};
