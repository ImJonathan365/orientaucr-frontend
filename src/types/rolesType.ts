import { Permissions } from './permissionType';

export interface Roles {
  rol_id: string;
  rol_name: string;
  permissions: Permissions[];
}

export interface UserRoles {
  rol_id: string;
  selected_permissions: string[]; 
}
