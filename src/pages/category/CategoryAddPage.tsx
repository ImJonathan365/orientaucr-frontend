import React, { useState, useEffect } from "react";
import { createCategory } from "../../services/Category";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Button } from "../../components/atoms/Button/Button";
import { getCurrentUser } from "../../services/userService";
import { User } from "../../types/userType";

export const CategoryAddPage = () => {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndPermissions = async () => {
      try {
        const user: User = await getCurrentUser();
        const hasPermission = user?.userRoles?.some(role =>
          role.permissions?.some(p => p.permissionName === "CREAR PREGUNTAS SIMULADAS")
        );
        if (!hasPermission) {
          await Swal.fire({
            icon: "warning",
            title: "Acceso denegado",
            text: "No tienes permiso para crear categorías.",
          });
          navigate("/categories", { replace: true });
          return;
        }
      } catch {
        await Swal.fire("Error", "No se pudo validar tu sesión", "error");
        navigate("/categories", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndPermissions();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      Swal.fire("Error", "El nombre de la categoría no puede estar vacío ni ser solo espacios.", "warning");
      return;
    }
    try {
      await createCategory({ categoryName: categoryName.trim() });
      await Swal.fire("Éxito", "Categoría creada correctamente", "success");
      navigate("/categories");
    } catch (err: any) {
      Swal.fire("Error", err.response?.data || "No se pudo crear la categoría", "error");
    }
  };

  if (loading) {
    return <div className="container py-4">Cargando...</div>;
  }

  return (
    <div className="container py-4">
      <h2>Nueva Categoría</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre de la categoría</label>
          <input
            className="form-control"
            value={categoryName}
            onChange={e => setCategoryName(e.target.value)}
            required
          />
        </div>
        <div className="d-flex gap-2">
          <Button type="button" variant="secondary" onClick={() => navigate("/categories")}>
            Volver
          </Button>
          <Button type="submit" variant="primary">
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};