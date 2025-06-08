import { useNavigate } from "react-router-dom";
import { createQuestion } from "../../services/simulationService";
import { SimulationQuestion } from "../../types/SimulationQuestion";
import { SimulationQuestionForm } from "../../components/organisms/FormBar/SimulationQuestionForm";
import Swal from "sweetalert2";
import { Title } from "../../components/atoms/Title/Ttile";

export const SimulationQuestionAddPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (question: SimulationQuestion) => {
    if (question.options.length !== 4) {
      Swal.fire("Error", "Deben ser 4 opciones.", "warning");
      return;
    }
    if (!question.options.some(opt => opt.isCorrect)) {
      Swal.fire("Error", "Debe marcar una opción como correcta.", "warning");
      return;
    }
    try {
      await createQuestion(question);
      await Swal.fire("Éxito", "Pregunta creada correctamente", "success");
      navigate("/simulation-questions"); // Redirige solo si fue exitoso
    } catch {
      Swal.fire("Error", "No se pudo crear la pregunta", "error");
    }
  };

  return (
    <div className="container py-4">
      <Title variant="h2" className="mb-4">Nueva Pregunta de Simulación</Title>
      <SimulationQuestionForm onSubmit={handleSubmit} />
    </div>
  );
};