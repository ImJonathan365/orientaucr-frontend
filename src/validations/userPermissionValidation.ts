import { User } from "../types/userType";

interface UserPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canCreate: boolean;
}

export function validateUserPermission(
    user: User | null,
    editPerm: string,
    deletePerm: string,
    createPerm: string
): UserPermissions {
  if (!user || !user.userRoles) {
    return { canEdit: false, canDelete: false, canCreate: false };
  }

  const allPermissions = user.userRoles.flatMap(role => role.permissions || []);
  const permissionNames = allPermissions.map(p => p.permissionName);

  return {
    canEdit: permissionNames.includes(editPerm),
    canDelete: permissionNames.includes(deletePerm),
    canCreate: permissionNames.includes(createPerm),
  };
}