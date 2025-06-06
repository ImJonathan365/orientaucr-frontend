import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, getAllUsers, updateUser } from "../../services/userService";
import { User } from "../../types/userType";
import { Roles } from "../../types/rolesType";
import { Permission } from "../../types/permissionType";
import { toast } from "react-toastify";

export const UserEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [roles, setRoles] = useState<Roles[]>([]);
    const [roleId, setRoleId] = useState<string>("");
    const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);
    const [userPermissions, setUserPermissions] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getUserById(id!);
                setUser(userData);

                // Si el usuario tiene roles, toma el primero (ajusta según tu lógica)
                let initialRoleId = "";
                if (userData.userRoles && userData.userRoles.length > 0) {
                    initialRoleId = userData.userRoles[0].rolId;
                }
                setRoleId(initialRoleId);

                // Cargar todos los roles (de la base de datos)
                const allUsers = await getAllUsers();
                // Extraer todos los roles únicos de todos los usuarios (o usa un endpoint específico si tienes)
                const allRoles: Roles[] = [];
                allUsers.forEach(u => {
                    u.userRoles?.forEach(r => {
                        if (!allRoles.find(ar => ar.rolId === r.rolId)) {
                            allRoles.push(r);
                        }
                    });
                });
                setRoles(allRoles);

                // Cargar permisos del rol seleccionado
                if (initialRoleId && userData.userRoles) {
                    const selectedRole = userData.userRoles.find(r => r.rolId === initialRoleId);
                    setRolePermissions(selectedRole?.permissions || []);
                    // Solo los permisos que el usuario ya tiene deben estar checked
                    setUserPermissions(selectedRole?.permissions?.map(p => p.permissionId) || []);
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
        if (!roleId || !user) return;
        // Buscar el rol seleccionado en los roles del usuario o en la lista de roles
        let selectedRole: Roles | undefined =
            user.userRoles?.find(r => r.rolId === roleId) ||
            roles.find(r => r.rolId === roleId);

        setRolePermissions(selectedRole?.permissions || []);
        setUserPermissions(selectedRole?.permissions?.map(p => p.permissionId) || []);
    }, [roleId, user, roles]);

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
            const updatedUser: User = {
                ...user,
                userRoles: [
                    {
                        ...roles.find(r => r.rolId === roleId)!,
                        permissions: rolePermissions.filter(p => userPermissions.includes(p.permissionId))
                    }
                ]
            };
            await updateUser(updatedUser);
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
                <input className="form-control" value={user.userName} disabled />
            </div>
            <div className="mb-3">
                <label className="form-label">Apellido</label>
                <input className="form-control" value={user.userLastname} disabled />
            </div>
            <div className="mb-3">
                <label className="form-label">Correo</label>
                <input className="form-control" value={user.userEmail} disabled />
            </div>
            <div className="mb-3">
                <label className="form-label">Rol</label>
                <select className="form-select" value={roleId} onChange={handleRoleChange}>
                    <option value="">Seleccione un rol</option>
                    {roles.map(role => (
                        <option key={role.rolId} value={role.rolId}>
                            {role.rolName}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label">Permisos</label>
                <div>
                    {rolePermissions.map(perm => (
                        <div key={perm.permissionId} className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={perm.permissionId}
                                checked={userPermissions.includes(perm.permissionId)}
                                onChange={e => handlePermissionChange(perm.permissionId, e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor={perm.permissionId}>
                                {perm.permissionName}
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