import { useEffect, useState, useRef } from "react";
import { getSimulationExam, submitExamAttempt } from "../../services/simulationService";
import { SimulationQuestion } from "../../types/SimulationQuestion";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getUserFromLocalStorage } from "../../utils/Auth";

const EXAM_TIME = 2 * 60 * 60; 

export const SimulationExamPage = () => {
  const [questions, setQuestions] = useState<SimulationQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(EXAM_TIME);
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const navigate = useNavigate();
  const examSentRef = useRef(false);

  useEffect(() => {
    getSimulationExam().then(qs => {
      setQuestions(qs);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;
    if (timeLeft <= 0 && !examSentRef.current) {
      setTimeUp(true);
      handleSubmitExam(true);
      return;
    }
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, loading]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleOptionChange = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };
  const allAnswered = questions.length > 0 && questions.every(q => answers[q.questionId]);

  const handleSubmitExam = async (force = false) => {
    if (submitting || (!allAnswered && !force)) return;
    setSubmitting(true);
    examSentRef.current = true;
    let correctCount = 0;
    questions.forEach(q => {
      const selected = answers[q.questionId];
      if (
        selected &&
        q.options.find(opt => opt.optionId === selected && opt.isCorrect)
      ) {
        correctCount++;
      }
    });
    const score = (correctCount / questions.length) * 100;
    const userId = getUserFromLocalStorage()?.userId || "";

    try {
      await submitExamAttempt({
        attemptScore: score,
        userId,
      });

      if (force) {
        await Swal.fire("Tiempo terminado", `El examen se envió automáticamente. Tu puntaje es: ${score.toFixed(2)} (${correctCount} correctas)`, "info");
      } else {
        await Swal.fire("Examen enviado", `Tu puntaje es: ${score.toFixed(2)} (${correctCount} correctas)`, "success");
      }
      navigate("/home");
    } catch (err: any) {
      Swal.fire("Error", err.message || "No se pudo enviar el examen", "error");
    } finally {
      setSubmitting(false);
    }
  };
  const handleBack = async () => {
    const result = await Swal.fire({
      title: "¿Salir del examen?",
      text: "Si sales, perderás tu progreso. ¿Estás seguro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      navigate("/home");
    }
  };
  if (loading) return <div>Cargando examen...</div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-end mb-2">
        <button
          className="btn btn-secondary"
          onClick={handleBack}
          disabled={submitting}
        >
          Volver
        </button>
      </div>
      <h2>Examen Simulado</h2>
      <div className="mb-3">
        <b>Tiempo restante:</b> {formatTime(timeLeft)}
      </div>
      {questions.map((q, idx) => (
        <div key={q.questionId} className="mb-4">
          <div>
            <b>{idx + 1}.</b> {q.questionText}
          </div>
          <ul>
            {q.options.map(opt => (
              <li key={opt.optionId}>
                <label>
                  <input
                    type="radio"
                    name={`q_${q.questionId}`}
                    value={opt.optionId}
                    checked={answers[q.questionId] === opt.optionId}
                    onChange={() => handleOptionChange(q.questionId, opt.optionId)}
                    disabled={submitting || timeUp}
                  />
                  {" "}{opt.optionText}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="d-flex gap-2">
        <button
          className="btn btn-primary"
          onClick={() => handleSubmitExam()}
          disabled={submitting || !allAnswered || timeUp}
        >
          {submitting ? "Enviando..." : "Enviar respuestas"}
        </button>
      </div>
    </div>
  );
};