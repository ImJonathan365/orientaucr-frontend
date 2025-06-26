import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createQuestion, getAllQuestions } from "../../services/simulationService";
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
export const SimulationQuestionAddPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<SimulationQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const fetchUserAndPermissions = async () => {
      try {
        const user: User = await getCurrentUser();
        const hasPermission = user?.userRoles?.some(role =>
          role.permissions?.some(p => p.permissionName === "CREAR PREGUNTAS SIMULADAS")
        );

        if (hasPermission) {
          const data = await getAllQuestions();
          setQuestions(data);
          setAuthorized(true);
        } else {
          await Swal.fire({
            icon: "warning",
            title: "Acceso denegado",
            text: "No tienes permiso para crear preguntas de simulación.",
          });
          navigate("/simulation-questions", { replace: true });
        }
      } catch {
        await Swal.fire("Error", "No se pudo validar tu sesión", "error");
        navigate("/simulation-questions", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPermissions();
  }, [navigate]);

  const handleSubmit = async (question: SimulationQuestion) => {
    const newText = normalizeQuestionText(question.questionText);

    if (!/[a-zA-Z0-9]/.test(newText)) {
      Swal.fire("Error", "La pregunta debe contener al menos una letra o número.", "warning");
      return;
    }

    if (
      questions.some(
        q => normalizeQuestionText(q.questionText) === newText
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
      await createQuestion(question);
      await Swal.fire("Éxito", "Pregunta creada correctamente", "success");
      navigate("/simulation-questions");
    } catch {
      Swal.fire("Error", "No se pudo crear la pregunta", "error");
    }
  };

  if (loading) {
    return <div className="container py-4">Cargando...</div>;
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Nueva Pregunta de Simulación</h2>
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
      <SimulationQuestionForm onSubmit={handleSubmit} />
    </div>
  );
};
