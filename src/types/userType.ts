import { Roles } from "./rolesType";

export interface User {
  userId?: string;
  userName: string;
  userLastname: string;
  userEmail: string;
  userBirthdate: string | null;
  userPassword: string;
  userAdmissionAverage: number | null;
  userProfilePicture?: string;
  userAllowEmailNotification: boolean;
  userRoles?: Roles[];
}

export type UserFormData = {
  userId: string;
  userLastname: string;
  userEmail: string;
  userBirthdate: string;
  userPassword: string;
  userAdmissionAverage: string;
  userAllowEmailNotification: boolean;
  userProfilePicture?: string | null;
};
