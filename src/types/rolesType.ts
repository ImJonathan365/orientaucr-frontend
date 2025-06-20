import { Permission } from './permissionType';

export interface Roles {
  rolId: string;
  rolName: string;
  permissions: Permission[]; 
}

export interface UserRoles {
  rold: string;
  selectedPermissions: string[];
}
