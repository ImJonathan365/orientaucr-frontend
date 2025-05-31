import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Roles } from "../../types/rolesType";
import { addRoles } from "../../services/RolesService";
import { getAllPermissions } from "../../services/RolesService";
import { Permissions } from "../../types/permissionType";
import { Input } from "../../components/atoms/Input/Input";
import { Title } from "../../components/atoms/Title/Ttile";

export const RolesAddPage = () => {
    const navigate = useNavigate();
    const [Roles, setRoles] = useState<Roles>({
        rol_id: "",
        rol_name: "",
        permissions: [],
    });
    const [loading, setLoading] = useState(true);
    const [Permissions, setPermissions] = useState<Permissions[]>([]);

    useEffect(() => {
        const fetchCharacteristics = async () => {
            try {
                const data = await getAllPermissions();
                setPermissions(data);
            } catch {
                setPermissions([]);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudieron cargar los permisos",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchCharacteristics();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRoles({ ...Roles, [name]: value });
    };

    const handleAddRoles = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPermissionsId = e.target.value;
        const selectedPermissions = Permissions.find(c => c.permission_id === selectedPermissionsId);
        if (selectedPermissions) {
            setRoles({
                ...Roles,
                permissions: [...Roles.permissions, selectedPermissions],
            });
        }
    };

    const handleRemovePemissions = (PermissionId: string) => {
        setRoles({
            ...Roles,
            permissions: Roles.permissions.filter(c => c.permission_id !== PermissionId),
        });
        Swal.fire({
            icon: "info",
            title: "Permiso eliminado",
            text: "Se eliminó el permiso de la lista.",
            timer: 1500,
            showConfirmButton: false,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await addRoles(Roles);
            await Swal.fire({
                icon: "success",
                title: "Rol añadido",
                text: "El rol se añadió correctamente.",
                confirmButtonText: "Aceptar",
            });
            navigate("/roles-list");
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo añadir el rol. Inténtalo nuevamente.",
            });
        }
    };

    return (
        <div className="container py-4">
            <Title variant="h2" className="mb-4">Añadir Rol</Title>
            {loading ? (
                <p>Cargando permisos...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    {/* Nombre del Rol */}
                    <div className="mb-3">
                        <label htmlFor="rol_name" className="form-label">Nombre del Rol</label>
                        <Input
                            type="text"
                            className="form-control"
                            id="rol_name"
                            name="rol_name"
                            value={Roles.rol_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Selección de Permisos */}
                    <div className="mb-3">
                        <label htmlFor="permissions" className="form-label">Permisos</label>
                        <select
                            className="form-select"
                            id="permissions"
                            onChange={handleAddRoles}
                            defaultValue=""
                        >
                            <option value="" disabled>Seleccione un permiso</option>
                            {Permissions.map((p) => (
                                <option key={p.permission_id} value={p.permission_id}>
                                    {p.permission_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Lista de permisos seleccionados */}
                    <ul className="list-group mb-3">
                        {Roles.permissions.map((p) => (
                            <li
                                key={p.permission_id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                {p.permission_name}
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleRemovePemissions(p.permission_id)}
                                >
                                    Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* Botón para guardar */}
                    <button type="submit" className="btn btn-primary">Guardar Rol</button>
                </form>
            )}
        </div>
    );
};
