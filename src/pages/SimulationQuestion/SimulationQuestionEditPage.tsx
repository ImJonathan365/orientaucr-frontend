import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllQuestions, getQuestionById, updateQuestion } from "../../services/simulationService";
import { SimulationQuestion } from "../../types/SimulationQuestion";
import { SimulationQuestionForm } from "../../components/organisms/FormBar/SimulationQuestionForm";
import Swal from "sweetalert2";
import { Button } from "../../components/atoms/Button/Button";
import { Icon } from "../../components/atoms/Icon/Icon";
import { getCurrentUser } from "../../services/userService";
import { User } from "../../types/userType";

function normalizeQuestionText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const SimulationQuestionEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initial, setInitial] = useState<SimulationQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<SimulationQuestion[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const user: User = await getCurrentUser();
        const hasPermission = user?.userRoles?.some(role =>
          role.permissions?.some(p => p.permissionName === "MODIFICAR PREGUNTAS SIMULADAS")
        );
        if (!hasPermission) {
          await Swal.fire({
            icon: "warning",
            title: "Acceso denegado",
            text: "No tienes permiso para editar preguntas de simulación.",
          });
          navigate("/simulation-questions", { replace: true });
          return;
        }
        if (id) {
          const [data, allQuestions] = await Promise.all([
            getQuestionById(id),
            getAllQuestions()
          ]);
          setInitial(data);
          setQuestions(allQuestions);
        }
      } catch {
        Swal.fire("Error", "No se pudo validar tu sesión", "error");
        navigate("/simulation-questions", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id, navigate]);

  const handleSubmit = async (question: SimulationQuestion) => {
    const newText = normalizeQuestionText(question.questionText);

    if (!/[a-zA-Z0-9]/.test(newText)) {
      Swal.fire("Error", "La pregunta debe contener al menos una letra o número.", "warning");
      return;
    }

    if (
      questions.some(
        q =>
          q.questionId !== question.questionId &&
          normalizeQuestionText(q.questionText) === newText
      )
    ) {
      Swal.fire("Error", "Ya existe una pregunta con ese texto.", "warning");
      return;
    }
    const normalizedOptions = question.options.map(opt =>
      normalizeQuestionText(opt.optionText)
    );
    const uniqueOptions = new Set(normalizedOptions);
    if (uniqueOptions.size !== normalizedOptions.length) {
      Swal.fire("Error", "No puede haber opciones repetidas.", "warning");
      return;
    }

    if (question.options.length !== 4) {
      Swal.fire("Error", "Deben ser 4 opciones.", "warning");
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Editar Pregunta de Simulación</h2>
        <div className="d-flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate('/simulation-questions')}
          >
            <Icon variant="arrow-left" className="me-2" />
            Volver
          </Button>
        </div>
      </div>
      <SimulationQuestionForm initial={initial} onSubmit={handleSubmit} />
    </div>
  );
};