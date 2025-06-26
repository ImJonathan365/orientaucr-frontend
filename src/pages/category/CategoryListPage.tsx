import React, { useEffect, useState } from "react";
import { getAllCategories, deleteCategory } from "../../services/Category";
import { Category } from "../../types/Category";
import Swal from "sweetalert2";
import { Button } from "../../components/atoms/Button/Button";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../services/userService";
import { User } from "../../types/userType";

export const CategoryListPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [canDelete, setCanDelete] = useState(false);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch {
      setCategories([]);
      Swal.fire("Error", "No se pudieron cargar las categorías", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const user: User = await getCurrentUser();
        const hasPermission = user?.userRoles?.some(role =>
          role.permissions?.some(p => p.permissionName === "ELIMINAR PREGUNTAS SIMULADAS")
        );
        setCanDelete(!!hasPermission);
      } catch {
        setCanDelete(false);
      }
    };
    checkPermissions();
    fetchCategories();
  }, []);

  const handleEdit = (category: Category) => {
    navigate(`/categories/edit/${category.categoryId}`);
  };

  const handleDelete = async (category: Category) => {
    if (!canDelete) {
      Swal.fire("Acceso denegado", "No tienes permiso para eliminar categorías.", "warning");
      return;
    }
    
    const result = await Swal.fire({
      title: "¿Eliminar categoría?",
      text: `¿Seguro que deseas eliminar la categoría: ${category.categoryName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    
    if (result.isConfirmed) {
      try {
        await deleteCategory(category.categoryId);
        await Swal.fire("Eliminado", "La categoría fue eliminada correctamente", "success");
        fetchCategories();
      } catch {
        Swal.fire("Error", "No se pudo eliminar la categoría", "error");
      }
    }
  };

  return (
    <div className="container py-4">
      <h2>Categorías</h2>
      <div className="d-flex gap-2 mb-3">
        <Button variant="secondary" onClick={() => navigate("/home")}>
          Volver
        </Button>
        <Button variant="primary" onClick={() => navigate("/categories/add")}>
          Nueva Categoría
        </Button>
      </div>
      
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul className="list-group mt-3">
          {categories.map(cat => (
            <li key={cat.categoryId} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{cat.categoryName}</span>
              <div className="d-flex gap-2">
                <Button variant="primary" size="small" onClick={() => handleEdit(cat)}>
                  Editar
                </Button>
                <Button variant="danger" size="small" onClick={() => handleDelete(cat)}>
                  Eliminar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};