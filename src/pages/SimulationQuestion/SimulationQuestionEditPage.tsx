import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQuestionById, updateQuestion } from "../../services/simulationService";
import { SimulationQuestion } from "../../types/SimulationQuestion";
import { SimulationQuestionForm } from "../../components/organisms/FormBar/SimulationQuestionForm";
import Swal from "sweetalert2";
import { Title } from "../../components/atoms/Title/Ttile";

export const SimulationQuestionEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initial, setInitial] = useState<SimulationQuestion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (id) {
          const data = await getQuestionById(id);
          setInitial(data);
        }
      } catch {
        Swal.fire("Error", "No se pudo cargar la pregunta", "error");
        navigate("/simulation-questions");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleSubmit = async (question: SimulationQuestion) => {
    if (question.options.length < 2) {
      Swal.fire("Error", "Debe agregar al menos dos opciones.", "warning");
      return;
    }
    if (!question.options.some(opt => opt.isCorrect)) {
      Swal.fire("Error", "Debe marcar una opción como correcta.", "warning");
      return;
    }
    try {
      await updateQuestion(question);
      await Swal.fire("Éxito", "Pregunta actualizada correctamente", "success");
      navigate("/simulation-questions");
    } catch (err) {
      Swal.fire("Error", "No se pudo actualizar la pregunta", "error");
      console.error("Error actualizando pregunta:", err);
    }
  };

  if (loading) return <div className="container py-4">Cargando...</div>;
  if (!initial) return null;

  return (
    <div className="container py-4">
      <Title variant="h2" className="mb-4">Editar Pregunta de Simulación</Title>
      <SimulationQuestionForm initial={initial} onSubmit={handleSubmit} />
    </div>
  );
};