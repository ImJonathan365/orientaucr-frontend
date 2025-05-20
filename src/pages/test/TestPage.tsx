import { useEffect, useState } from 'react';
import { Test } from '../../types/testType';
import { getAllTests, submitTestAnswers } from '../../services/testService';
import { UserTestAnswer } from '../../types/testType';

export const TestPage = () => {
  const [testQuestions, setTestQuestions] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questions = await getAllTests();
        setTestQuestions(questions);
      } catch (error) {
        setTestQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleOptionChange = (questionId: string, characteristicId: string, checked: boolean) => {
    setAnswers(prev => {
      const prevSelected = prev[questionId] || [];
      let updated: string[];
      if (checked) {
        updated = [...prevSelected, characteristicId];
      } else {
        updated = prevSelected.filter(id => id !== characteristicId);
      }
      return { ...prev, [questionId]: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitResult(null);
    try {
      const formattedAnswers: UserTestAnswer[] = testQuestions.map(q => ({
        question_id: q.question_id,
        selected_characteristics: answers[q.question_id] || []
      }));
      const result = await submitTestAnswers(formattedAnswers);
      setSubmitResult(result);
    } catch (error: any) {
      setSubmitResult(error?.message || "Error al enviar respuestas");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="test">
      <center>
        <h1>Test</h1>
        <p>Esta es la página de test.</p>
        {loading ? (
          <p>Cargando preguntas...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <ul style={{ textAlign: "left", display: "inline-block" }}>
              {testQuestions.map((q) => (
                <li key={q.question_id} style={{ marginBottom: "1.5rem" }}>
                  <strong>{q.question_text}</strong>
                  <ul>
                    {q.characteristics.map((c) => (
                      <li key={c.characteristics_id}>
                        <label>
                          <input
                            type="checkbox"
                            value={c.characteristics_id}
                            checked={answers[q.question_id]?.includes(c.characteristics_id) || false}
                            onChange={e =>
                              handleOptionChange(q.question_id, c.characteristics_id, e.target.checked)
                            }
                          />
                          {" "}{c.characteristics_name}
                        </label>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <button type="submit" disabled={submitting}>
              {submitting ? "Enviando..." : "Enviar respuestas"}
            </button>
            {submitResult && <p>{submitResult}</p>}
          </form>
        )}
      </center>
    </div>
  );
};