import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../../services/userService";
import { getAllRoles } from "../../services/rolesService";
import { User } from "../../types/userType";
import { Roles } from "../../types/rolesType";
import { Permission } from "../../types/permissionType";
import Swal from "sweetalert2";
import { Button } from "../../components/atoms/Button/Button";

export const UserEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [roles, setRoles] = useState<Roles[]>([]);
    const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
    const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);
    const [userPermissions, setUserPermissions] = useState<string[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [form, setForm] = useState({
        userName: "",
        userLastname: "",
        userEmail: "",
        userBirthdate: "",
        userPassword: "",
        userAdmissionAverage: "",
        userAllowEmailNotification: true,
        userProfilePicture: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getUserById(id!);
                setUser(userData);
                setForm({
                    userName: userData.userName,
                    userLastname: userData.userLastname,
                    userEmail: userData.userEmail,
                    userBirthdate: userData.userBirthdate || "",
                    userPassword: userData.userPassword,
                    userAdmissionAverage: userData.userAdmissionAverage?.toString() || "",
                    userAllowEmailNotification: userData.userAllowEmailNotification,
                    userProfilePicture: userData.userProfilePicture || "",
                });
                const allRoles = await getAllRoles();
                setRoles(allRoles);
                setSelectedRoleIds(userData.userRoles?.map(r => r.rolId) || []);
                if (userData.userRoles && userData.userRoles.length > 0) {
                    setRolePermissions(userData.userRoles[0].permissions || []);
                    setUserPermissions(userData.userRoles[0].permissions?.map(p => p.permissionId) || []);
                }
            } catch (error) {
                Swal.fire({ icon: "error", title: "Error", text: "Error al cargar datos del usuario" });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        if (type === "checkbox") {
            setForm(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleRoleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value && !selectedRoleIds.includes(value)) {
            setSelectedRoleIds(prev => [...prev, value]);
            const selectedRole = roles.find(r => r.rolId === value);
            setRolePermissions(selectedRole?.permissions || []);
            setUserPermissions(selectedRole?.permissions?.map(p => p.permissionId) || []);
        }
    };

    const handleRemoveRole = (rolId: string) => {
        setSelectedRoleIds(prev => prev.filter(id => id !== rolId));
    };

    const handleShowPermissions = (rolId: string) => {
        const role = roles.find(r => r.rolId === rolId);
        if (role) {
            const perms = role.permissions.map(p => p.permissionName).join(' - ');
            Swal.fire({
                title: `Permisos de ${role.rolName}`,
                text: perms || "Sin permisos",
                icon: "info",
                confirmButtonText: "Cerrar"
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (!["image/png", "image/jpeg"].includes(file.type)) {
                Swal.fire({
                    icon: "error",
                    title: "Archivo no válido",
                    text: "Solo se permiten imágenes PNG o JPG",
                    confirmButtonText: "Aceptar"
                });
                e.target.value = "";
                setImageFile(null);
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                Swal.fire({
                    icon: "error",
                    title: "Archivo muy grande",
                    text: "La imagen debe pesar menos de 2MB",
                });
                e.target.value = "";
                setImageFile(null);
                return;
            }
            setImageFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (!form.userName.trim()) {
                Swal.fire({ icon: "error", title: "Nombre requerido", text: "El nombre no puede estar vacío o solo espacios." });
                setIsLoading(false);
                return;
            }
            const avg = form.userAdmissionAverage === "" ? null : Number(form.userAdmissionAverage);
            if (avg !== null && (avg < 0 || avg > 800)) {
                Swal.fire({ icon: "error", title: "Promedio inválido", text: "El promedio debe estar entre 0 y 800." });
                setIsLoading(false);
                return;
            }
            if (form.userBirthdate && isFutureDate(form.userBirthdate)) {
                Swal.fire({
                    icon: "error",
                    title: "Fecha inválida",
                    text: "La fecha de nacimiento no puede ser futura.",
                });
                setIsLoading(false);
                return;
            }
            if (form.userPassword.length < 8) {
                Swal.fire({
                    icon: "error",
                    title: "Contraseña inválida",
                    text: "Debe tener al menos 8 caracteres.",
                });
                setIsLoading(false);
                return;
            }
            const selectedRoles = roles.filter(r => selectedRoleIds.includes(r.rolId));
            const updatedUser: User = {
                ...user!,
                userName: form.userName,
                userLastname: form.userLastname,
                userEmail: form.userEmail,
                userBirthdate: form.userBirthdate,
                userPassword: form.userPassword,
                userAdmissionAverage: form.userAdmissionAverage === "" ? null : Number(form.userAdmissionAverage),
                userAllowEmailNotification: form.userAllowEmailNotification,
                userProfilePicture: "",
                userRoles: selectedRoles.map(role => ({
                    rolId: role.rolId,
                    rolName: role.rolName,
                    permissions: role.permissions
                }))
            };
            await updateUser(updatedUser, imageFile || undefined);
            await Swal.fire({
                icon: "success",
                title: "Usuario actualizado correctamente",
                confirmButtonText: "Aceptar"
            });
            navigate('/users');
        } catch (err: any) {
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message || "Error al actualizar usuario",
                confirmButtonText: "Aceptar"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const allowedNameKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const allowed = /^[A-Za-z0-9áéíóúÁÉÍÓÚñÑ ]$/;
        if (
            e.key.length === 1 &&
            !allowed.test(e.key) &&
            !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End'].includes(e.key)
        ) {
            e.preventDefault();
        }
    };

    const isFutureDate = (dateStr: string) => {
        const today = new Date().toISOString().split("T")[0];
        return dateStr > today;
    };

    if (isLoading) {
        return <div className="container"><p>Cargando...</p></div>;
    }

    if (!user) {
        return <div className="container"><p>No se encontró el usuario.</p></div>;
    }

    return (
        <div className="container py-4">
            <h2 className="mb-4">Editar Usuario</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        name="userName"
                        value={form.userName}
                        onChange={handleChange}
                        onKeyDown={allowedNameKey}
                        min={1}
                        maxLength={100}
                        pattern="^[A-Za-z0-9áéíóúÁÉÍÓÚñÑ ]{1,100}$"
                        title="Solo letras y números, máximo 100 caracteres"
                        required
                        placeholder="Ejm: Juan"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Apellido</label>
                    <input
                        type="text"
                        className="form-control"
                        name="userLastname"
                        value={form.userLastname}
                        onChange={handleChange}
                        onKeyDown={allowedNameKey}
                        min={1}
                        maxLength={100}
                        pattern="^[A-Za-z0-9áéíóúÁÉÍÓÚñÑ ]{1,100}$"
                        title="Solo letras y números, máximo 100 caracteres"
                        placeholder="Ejm: Pérez"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Correo electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        name="userEmail"
                        value={form.userEmail}
                        onChange={handleChange}
                        maxLength={255}
                        pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                        title="Debe ser un correo electrónico válido"
                        required
                        placeholder="ejemplo@correo.com"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Fecha de nacimiento</label>
                    <input
                        type="date"
                        className="form-control"
                        name="userBirthdate"
                        value={form.userBirthdate}
                        onChange={handleChange}
                        onKeyDown={e => e.preventDefault()}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        name="userPassword"
                        value={form.userPassword}
                        onChange={handleChange}
                        min={8}
                        maxLength={255}
                        title="Debe tener al menos 8 carácteres"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Promedio de admisión</label>
                    <input
                        type="number"
                        className="form-control"
                        name="userAdmissionAverage"
                        value={form.userAdmissionAverage}
                        onChange={handleChange}
                        min={0}
                        max={800}
                        step={0.01}
                        title="Debe ser un número entre 0 y 800"
                    />
                </div>
                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="userAllowEmailNotification"
                        name="userAllowEmailNotification"
                        checked={form.userAllowEmailNotification}
                        onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="userAllowEmailNotification">
                        Permitir notificaciones por correo
                    </label>
                </div>
                <div className="mb-3">
                    <label className="form-label">Imagen de perfil</label>
                    <input
                        type="file"
                        className="form-control"
                        name="userProfilePicture"
                        accept="image/png, image/jpeg"
                        onChange={handleFileChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Agregar rol</label>
                    <select
                        className="form-select"
                        onChange={handleRoleSelect}
                        value=""
                    >
                        <option value="" disabled>
                            Selecciona un rol
                        </option>
                        {roles
                            .filter(role => !selectedRoleIds.includes(role.rolId))
                            .map(role => (
                                <option key={role.rolId} value={role.rolId}>
                                    {role.rolName}
                                </option>
                            ))}
                    </select>
                </div>
                {selectedRoleIds.length > 0 && (
                    <div className="mb-3">
                        <label className="form-label">Roles seleccionados:</label>
                        <ul className="list-group mb-3">
                            {selectedRoleIds.map(rolId => {
                                const role = roles.find(r => r.rolId === rolId);
                                return (
                                    <li key={rolId} className="list-group-item d-flex justify-content-between align-items-center">
                                        <span>{role?.rolName || rolId}</span>
                                        <div>
                                            <Button
                                                type="button"
                                                variant="info"
                                                className="me-2"
                                                onClick={() => handleShowPermissions(rolId)}
                                            >
                                                Ver permisos
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="danger"
                                                onClick={() => handleRemoveRole(rolId)}
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
                <div className="d-flex gap-2">
                    <Button type="submit" variant="primary" disabled={isLoading}>
                        {isLoading ? "Guardando..." : "Guardar"}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => navigate('/users')}>
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
};