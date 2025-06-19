import React, { useEffect, useState } from "react";
import { getAllCategories, updateCategory } from "../../services/Category";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Button } from "../../components/atoms/Button/Button";
import { Category } from "../../types/Category";

export const CategoryEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      const categories = await getAllCategories();
      const found = categories.find(c => c.categoryId === id);
      if (found) {
        setCategory(found);
        setCategoryName(found.categoryName);
      } else {
        Swal.fire("Error", "Categoría no encontrada", "error");
        navigate("/categories");
      }
    };
    fetchCategory();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;
    if (!categoryName.trim()) {
      Swal.fire("Error", "El nombre de la categoría no puede estar vacío ni ser solo espacios.", "warning");
      return;
    }
    try {
      await updateCategory({ ...category, categoryName: categoryName.trim() });
      await Swal.fire("Éxito", "Categoría actualizada correctamente", "success");
      navigate("/categories");
    } catch (err: any) {
      Swal.fire("Error", err.response?.data || "No se pudo actualizar la categoría", "error");
    }
  };

  if (!category) return <div className="container py-4">Cargando...</div>;

  return (
    <div className="container py-4">
      <h2>Editar Categoría</h2>
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