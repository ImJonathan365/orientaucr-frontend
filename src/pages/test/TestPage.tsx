import { useEffect, useState } from 'react';
import { Test, UserTestAnswer } from '../../types/testType';
import { getAllTests } from '../../services/testService';
import { getRecommendation } from '../../services/vocationalService';
import { VocationalRecommendationResponse } from '../../types/vocationalType';

export const TestPage = () => {
  const [testQuestions, setTestQuestions] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<VocationalRecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questions = await getAllTests();
        setTestQuestions(questions);
      } catch {
        setTestQuestions([]);
        setError('No se pudieron cargar las preguntas del test.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleOptionChange = (questionId: string, characteristicId: string, checked: boolean) => {
    setAnswers(prev => {
      const prevSelected = prev[questionId] || [];
      const updated = checked
        ? [...prevSelected, characteristicId]
        : prevSelected.filter(id => id !== characteristicId);
      return { ...prev, [questionId]: updated };
    });
  };

  const answeredCount = testQuestions.filter(q => (answers[q.questionId]?.length || 0) > 0).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const formattedAnswers: UserTestAnswer[] = testQuestions.map(q => ({
        questionId: q.questionId,
        selectedCharacteristics: answers[q.questionId] || [],
      }));
      const recommendation = await getRecommendation(formattedAnswers, 3);
      setResult(recommendation);
    } catch (err: any) {
      setError(err?.response?.data || err?.message || 'Error al generar la recomendación.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setAnswers({});
    setError(null);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3">Cargando preguntas...</p>
      </div>
    );
  }

  // --- Vista de resultados ---------------------------------------------------
  if (result) {
    const top = result.recommendations[0];
    return (
      <div className="container py-5" style={{ maxWidth: 760 }}>
        <h1 className="text-center mb-4">Tu recomendación vocacional</h1>

        {top && (
          <div className="card border-primary shadow-sm mb-4">
            <div className="card-body text-center">
              <p className="text-muted mb-1">Carrera más afín a tu perfil</p>
              <h2 className="text-primary mb-2">{top.career_name}</h2>
              <span className="badge bg-primary fs-6">
                {Math.round(top.score * 100)}% de afinidad
              </span>
            </div>
          </div>
        )}

        <h5 className="mb-3">Ranking de carreras</h5>
        <ul className="list-group mb-4">
          {result.recommendations.map((rec, i) => (
            <li key={rec.career_id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span><strong>{i + 1}.</strong> {rec.career_name}</span>
                <span className="text-muted">{Math.round(rec.score * 100)}%</span>
              </div>
              <div className="progress" style={{ height: 8 }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${Math.round(rec.score * 100)}%` }}
                  aria-valuenow={Math.round(rec.score * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </li>
          ))}
        </ul>

        {result.explanation?.length > 0 && (
          <div className="card mb-4">
            <div className="card-header">¿Por qué esta recomendación?</div>
            <ul className="list-group list-group-flush">
              {result.explanation.map((rule, i) => (
                <li key={i} className="list-group-item">{rule}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-center">
          <button className="btn btn-outline-primary" onClick={handleRetry}>
            Volver a hacer el test
          </button>
        </div>
      </div>
    );
  }

  // --- Vista del test --------------------------------------------------------
  return (
    <div className="container py-5" style={{ maxWidth: 760 }}>
      <h1 className="text-center mb-2">Test Vocacional</h1>
      <p className="text-center text-muted mb-4">
        Selecciona las opciones con las que más te identifiques.
      </p>

      {error && <div className="alert alert-danger">{String(error)}</div>}

      {testQuestions.length === 0 ? (
        <p className="text-center text-muted">No hay preguntas disponibles.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {testQuestions.map((q, idx) => (
            <div key={q.questionId} className="card mb-3 shadow-sm">
              <div className="card-body">
                <h6 className="card-title">
                  {idx + 1}. {q.questionText}
                </h6>
                {q.questionHelpText && (
                  <p className="text-muted small mb-2">{q.questionHelpText}</p>
                )}
                {q.characteristics.map(c => (
                  <div key={c.characteristicsId} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`${q.questionId}-${c.characteristicsId}`}
                      value={c.characteristicsId}
                      checked={answers[q.questionId]?.includes(c.characteristicsId) || false}
                      onChange={e =>
                        handleOptionChange(q.questionId, c.characteristicsId, e.target.checked)
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`${q.questionId}-${c.characteristicsId}`}
                    >
                      {c.characteristicsName}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="text-center mt-4">
            <p className="text-muted small">
              {answeredCount} de {testQuestions.length} preguntas respondidas
            </p>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={submitting || answeredCount === 0}
            >
              {submitting ? 'Generando recomendación...' : 'Ver mi recomendación'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
