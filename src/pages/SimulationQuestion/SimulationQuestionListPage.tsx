import { useEffect, useState } from "react";
import { getAllQuestions, deleteQuestion } from "../../services/simulationService";
import { SimulationQuestion } from "../../types/SimulationQuestion";
import { Table, TableColumn } from "../../components/organisms/Tables/Table";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Button } from "../../components/atoms/Button/Button";
import { Icon } from "../../components/atoms/Icon/Icon";

const translateDifficulty = (difficulty?: string) => {
  switch (difficulty) {
    case "easy":
      return "Fácil";
    case "medium":
      return "Media";
    case "hard":
      return "Difícil";
    default:
      return "-";
  }
};

export const SimulationQuestionListPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<SimulationQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await getAllQuestions();
      // Ordenar alfabéticamente por el texto de la pregunta
      data.sort((a, b) => a.questionText.localeCompare(b.questionText));
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
        fetchQuestions();
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
      key: "categories",
      label: "Categorías",
      render: (row) =>
        row.categories && row.categories.length > 0
          ? row.categories.map(cat => cat.categoryName).join(", ")
          : "-",
    },
    {
      key: "difficulty",
      label: "Dificultad",
      render: (row) => translateDifficulty(row.difficulty),
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (row) => (
        <div className="d-flex gap-2">
          <Button
            variant="primary"
            size="small"
            style={{ minWidth: 90 }}
            onClick={() => handleEdit(row)}>
            <Icon variant="edit" className="me-2" />
            Editar
          </Button>
          <Button
            variant="danger"
            size="small"
            style={{ minWidth: 90 }}
            onClick={() => handleDelete(row)}>
            <Icon variant="trash" className="me-2" />
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div>Cargando preguntas...</div>;
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Preguntas de Simulación</h2>
        <div className="d-flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate('/home')}
          >
            <Icon variant="home" className="me-2" />
            Volver
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/simulation-questions/add')}
          >
            <Icon variant="add" className="me-2" />
            Añadir Pregunta
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        data={questions}
      />
    </div>
  );
};