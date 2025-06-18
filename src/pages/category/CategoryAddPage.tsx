import React, { useState } from "react";
import { createCategory } from "../../services/Category";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Button } from "../../components/atoms/Button/Button";

export const CategoryAddPage = () => {
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategory({ categoryName });
      await Swal.fire("Éxito", "Categoría creada correctamente", "success");
      navigate("/categories");
    } catch (err: any) {
      Swal.fire("Error", err.response?.data || "No se pudo crear la categoría", "error");
    }
  };

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