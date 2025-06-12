import React, { useState } from "react";
import { UserProfileCard } from "../../components/organisms/LoginSection/UserProfileCardProps";
import { getUserFromLocalStorage } from "../../utils/Auth";
import { User } from "../../types/userType";
import { Permission } from "../../types/permissionType";
import { updateUser } from "../../services/userService";
import Swal from "sweetalert2";

export const UserProfile = () => {
  const userLocal = getUserFromLocalStorage() as User | null;
  const [user, setUser] = useState<User | null>(userLocal);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>(
    user?.userRoles && user.userRoles.length > 0 ? user.userRoles[0].permissions || [] : []
  );
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    user?.userRoles && user.userRoles.length > 0
      ? user.userRoles[0].permissions?.map(p => p.permissionId) || []
      : []
  );

  if (!user) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger text-center">
          No se encontró información del usuario.
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setUser(prev =>
      prev
        ? {
            ...prev,
            [name]:
              type === "number"
                ? value === "" ? null : Number(value)
                : type === "checkbox"
                ? checked
                : type === "date"
                ? value || null
                : value,
          }
        : prev
    );
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const updatedUser: User = {
        ...user,
        userRoles:
          user.userRoles && user.userRoles.length > 0
            ? [
                {
                  ...user.userRoles[0],
                  permissions: permissions.filter(p =>
                    selectedPermissions.includes(p.permissionId)
                  ),
                },
              ]
            : [],
      };
      await updateUser(updatedUser);
      setIsEditing(false);
      setUser(updatedUser);
      await Swal.fire({
        icon: "success",
        title: "Perfil actualizado",
        confirmButtonText: "Aceptar",
      });
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al guardar los cambios",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePermissionCheckboxChange = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleDeletePermissions = async () => {
    if (!user || selectedPermissions.length === 0) return;
    setIsSaving(true);
    try {
      setPermissions(prev =>
        prev.filter(p => !selectedPermissions.includes(p.permissionId))
      );
      setSelectedPermissions([]);
      const updatedUser: User = {
        ...user,
        userRoles:
          user.userRoles && user.userRoles.length > 0
            ? [
                {
                  ...user.userRoles[0],
                  permissions: permissions.filter(
                    p => !selectedPermissions.includes(p.permissionId)
                  ),
                },
              ]
            : [],
      };
      await updateUser(updatedUser);
      setUser(updatedUser);
      await Swal.fire({
        icon: "success",
        title: "Permisos eliminados",
        confirmButtonText: "Aceptar",
      });
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al eliminar permisos",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Mi Perfil</h2>
      <UserProfileCard
        editableFields={["personal_info", "role_permissions", "notifications"]}
        user={user}
        isEditing={isEditing}
        onEditToggle={() => setIsEditing(!isEditing)}
        onSave={handleSave}
        onInputChange={handleInputChange}
        isLoading={false}
        isSaving={isSaving}
        permissions={permissions}
        selectedPermissions={selectedPermissions}
        onPermissionCheckboxChange={handlePermissionCheckboxChange}
        onDeletePermissions={handleDeletePermissions}
      />
    </div>
  );
};