import { useEffect, useState } from "react";
import { getAllTests, deleteTest } from "../../services/testService";
import { Test } from "../../types/testType";
import { Table, TableColumn } from "../../components/organisms/Tables/Table";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/atoms/Button/Button";
import { Icon } from "../../components/atoms/Icon/Icon";
import Swal from "sweetalert2";

type TestWithActions = Test & { onDelete: (test: Test) => void; onEdit: (test: Test) => void };

const columns: TableColumn<TestWithActions>[] = [
  { key: "questionText", label: "Pregunta" },
  { key: "questionHelpText", label: "Ayuda adicional", render: row => row.questionHelpText || <span className="text-muted">Sin ayuda</span> },
  { key: "isActive", label: "Está activa", render: row => row.isActive ? "Sí" : "No" },
  { key: "isMultipleSelection", label: "De selección múltiple", render: row => row.isMultipleSelection ? "Sí" : "No" },
  {
    key: "characteristics",
    label: "Características",
    render: (row) => (
      <select className="form-select" >
        {row.characteristics && row.characteristics.length > 0 ? (
          row.characteristics.map((c) => (
            <option key={c.characteristicsId}>{c.characteristicsName}</option>
          ))
        ) : (
          <option>Sin características</option>
        )}
      </select>
    ),
  }
];

export const TestListPage = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarTests();
  }, []);

  const cargarTests = () => {
    setLoading(true);
    getAllTests()
      .then(setTests)
      .catch(() =>
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al cargar preguntas del test",
        })
      )
      .finally(() => setLoading(false));
  };

  const handleDelete = async (test: Test) => {
    const result = await Swal.fire({
      title: `¿Seguro que deseas eliminar esta pregunta?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteTest(test.questionId);
      await Swal.fire({
        icon: "success",
        title: "Pregunta eliminada correctamente",
        timer: 1500,
        showConfirmButton: false,
      });
      cargarTests();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al eliminar la pregunta",
      });
    }
  };

  const handleEdit = async (test: Test) => {
    const result = await Swal.fire({
      title: "¿Seguro que deseas editar esta pregunta?",
      text: "Podrás modificar el contenido de la pregunta.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      navigate(`/test-list/edit/${test.questionId}`);
    }
  };

  const handleCreate = () => {
    navigate("/test-list/add");
  };

  const handleBack = () => {
    navigate("/home");
  };

  const testsWithActions: TestWithActions[] = tests.map(t => ({
    ...t,
    onDelete: handleDelete,
    onEdit: handleEdit,
  }));

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button
          variant="secondary"
          onClick={handleBack}
        >
          <Icon variant="home" className="me-2" />
          Regresar
        </Button>
        <h2>Preguntas del Test</h2>
        <Button className="btn btn-primary" onClick={handleCreate}>
          <Icon variant="add" className="me-2" />
          Nueva Pregunta
        </Button>
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <Table
          columns={columns}
          data={testsWithActions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};