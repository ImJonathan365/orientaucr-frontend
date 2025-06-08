import { useEffect, useState } from "react";
import { getAllQuestions, deleteQuestion } from "../../services/simulationService";
import { SimulationQuestion } from "../../types/SimulationQuestion";
import { Table, TableColumn } from "../../components/organisms/Tables/Table";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Title } from "../../components/atoms/Title/Ttile";

export const SimulationQuestionListPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<SimulationQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await getAllQuestions();
      setQuestions(data);
    } catch {
      setQuestions([]);
      Swal.fire("Error", "No se pudieron cargar las preguntas", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleEdit = (question: SimulationQuestion) => {
    navigate(`/simulation-questions/edit/${question.questionId}`);
  };

  const handleDelete = async (question: SimulationQuestion) => {
    const result = await Swal.fire({
      title: "¿Eliminar pregunta?",
      text: `¿Seguro que deseas eliminar la pregunta: ${question.questionText}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteQuestion(question.questionId);
        await Swal.fire("Eliminado", "La pregunta fue eliminada correctamente", "success");
        fetchQuestions(); // Refresca la lista automáticamente
      } catch {
        Swal.fire("Error", "No se pudo eliminar la pregunta", "error");
      }
    }
  };

  const columns: TableColumn<SimulationQuestion>[] = [
    {
      key: "questionText",
      label: "Pregunta",
      render: (row) => row.questionText,
    },
    {
      key: "options",
      label: "Opciones",
      render: (row) => (
        <ul className="mb-0">
          {row.options?.map(opt => (
            <li key={opt.optionId}>
              {opt.optionText} {opt.isCorrect && <b>(Correcta)</b>}
            </li>
          ))}
        </ul>
      ),
    },
    {
      key: "questionCategory",
      label: "Categoría",
      render: (row) => row.questionCategory || "-",
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (row) => (
        <>
          <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(row)}>
            Editar
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>
            Eliminar
          </button>
        </>
      ),
    },
  ];

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mt-4">
        <Title variant="h2" className="mb-4">Preguntas de Simulación</Title>
        <Link to="/simulation-questions/add" className="btn btn-primary mb-4">
          Añadir Pregunta
        </Link>
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <Table
          columns={columns}
          data={questions}
        />
      )}
    </div>
  );
};