import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, getAllRoles, getPermissionsOfRole, getPermissionsOfUser, updateUserRoleAndPermissions } from "../../services/userService";
import { User } from "../../types/user";
import { Role, Permission } from "../../types/permissionAndRole";
import { toast } from "react-toastify";

export const UserEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [roleId, setRoleId] = useState<string>("");
    const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);
    const [userPermissions, setUserPermissions] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // Cargar datos del usuario y roles
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getUserById(id!);
                setUser(userData);
                setRoleId(userData.user_role || "");
                const rolesData = await getAllRoles();
                setRoles(rolesData);
                // Cargar permisos del usuario y del rol
                if (userData.user_role) {
                    const rolePerms = await getPermissionsOfRole(userData.user_role);
                    setRolePermissions(rolePerms);
                    const userPerms = await getPermissionsOfUser(userData.user_id!, userData.user_role);
                    setUserPermissions(userPerms.map(p => p.permission_id));
                }
            } catch (error) {
                toast.error("Error al cargar datos del usuario");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Cuando cambia el rol, cargar los permisos del nuevo rol
    useEffect(() => {
        const fetchRolePerms = async () => {
            if (roleId) {
                const perms = await getPermissionsOfRole(roleId);
                setRolePermissions(perms);
                setUserPermissions(perms.map(p => p.permission_id)); // Por defecto, todos los permisos del rol
            }
        };
        if (roleId && user && roleId !== user.user_role) {
            fetchRolePerms();
        }
        // eslint-disable-next-line
    }, [roleId]);

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRoleId(e.target.value);
    };

    const handlePermissionChange = (permId: string, checked: boolean) => {
        setUserPermissions(prev =>
            checked ? [...prev, permId] : prev.filter(id => id !== permId)
        );
    };

    const handleUpdate = async () => {
        if (!user) return;
        try {
            await updateUserRoleAndPermissions(
                user.user_id!,
                roleId,
                userPermissions
            );
            toast.success("Usuario actualizado correctamente");
            navigate("/usuarios");
        } catch (error) {
            toast.error("Error al actualizar usuario");
        }
    };

    if (loading) {
        return <div className="container"><p>Cargando...</p></div>;
    }

    if (!user) {
        return <div className="container"><p>No se encontró el usuario.</p></div>;
    }

    return (
        <div className="container">
            <h1>Editar Usuario</h1>
            <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input className="form-control" value={user.user_name} disabled />
            </div>
            <div className="mb-3">
                <label className="form-label">Apellido</label>
                <input className="form-control" value={user.user_lastname} disabled />
            </div>
            <div className="mb-3">
                <label className="form-label">Correo</label>
                <input className="form-control" value={user.user_email} disabled />
            </div>
            <div className="mb-3">
                <label className="form-label">Rol</label>
                <select className="form-select" value={roleId} onChange={handleRoleChange}>
                    <option value="">Seleccione un rol</option>
                    {roles.map(role => (
                        <option key={role.rol_id} value={role.rol_id}>
                            {role.rol_name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label">Permisos</label>
                <div>
                    {rolePermissions.map(perm => (
                        <div key={perm.permission_id} className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={perm.permission_id}
                                checked={userPermissions.includes(perm.permission_id)}
                                onChange={e => handlePermissionChange(perm.permission_id, e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor={perm.permission_id}>
                                {perm.permission_name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <button className="btn btn-primary" onClick={handleUpdate}>
                Guardar Cambios
            </button>
        </div>
    );
};