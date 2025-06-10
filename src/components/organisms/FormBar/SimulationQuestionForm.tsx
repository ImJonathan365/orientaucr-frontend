import React, { useState, useEffect } from "react";
import { SimulationQuestion, SimulationOption, Difficulty } from "../../../types/SimulationQuestion";
import { useNavigate } from "react-router-dom";

interface Props {
    initial?: SimulationQuestion;
    onSubmit: (q: SimulationQuestion) => void;
    loading?: boolean;
}

const defaultOptions: SimulationOption[] = [
    { optionId: "", optionText: "", isCorrect: false },
    { optionId: "", optionText: "", isCorrect: false },
    { optionId: "", optionText: "", isCorrect: false },
    { optionId: "", optionText: "", isCorrect: false },
];

export const SimulationQuestionForm: React.FC<Props> = ({ initial, onSubmit, loading }) => {
    const [questionText, setQuestionText] = useState(initial?.questionText ?? "");
    const [questionCategory, setQuestionCategory] = useState(initial?.questionCategory ?? "");
    const [difficulty, setDifficulty] = useState<Difficulty>(initial?.difficulty ?? "medium");
    const [options, setOptions] = useState<SimulationOption[]>(
        initial?.options && initial.options.length === 4
            ? initial.options
            : defaultOptions
    );
    const navigate = useNavigate();

    useEffect(() => {
        setQuestionText(initial?.questionText ?? "");
        setQuestionCategory(initial?.questionCategory ?? "");
        setDifficulty(initial?.difficulty ?? "medium");
        setOptions(
            initial?.options && initial.options.length === 4
                ? initial.options
                : defaultOptions
        );
    }, [initial]);

    const handleOptionChange = (idx: number, field: keyof SimulationOption, value: any) => {
        setOptions(opts =>
            field === "isCorrect"
                ? opts.map((opt, i) => ({ ...opt, isCorrect: i === idx ? value : false }))
                : opts.map((opt, i) => i === idx ? { ...opt, [field]: value } : opt)
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            questionId: initial?.questionId || "",
            questionText,
            questionCategory,
            difficulty, // <-- Nuevo campo
            options,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Pregunta</label>
                <input
                    type="text"
                    className="form-control"
                    value={questionText}
                    onChange={e => setQuestionText(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Categoría</label>
                <select
                    className="form-select"
                    value={questionCategory}
                    onChange={e => setQuestionCategory(e.target.value)}
                    required
                >
                    <option value="">Seleccione una categoría</option>
                    <option value="mathematical_logic">Lógica matemática</option>
                    <option value="verbal_logic">Lógica verbal</option>
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label">Dificultad</label>
                <select
                    className="form-select"
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value as Difficulty)}
                    required
                >
                    <option value="easy">Fácil</option>
                    <option value="medium">Media</option>
                    <option value="hard">Difícil</option>
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label mb-2">Opciones:</label>
                {options.map((opt, idx) => (
                    <div className="mb-2" key={idx}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder={`Opción ${idx + 1}`}
                            value={opt.optionText}
                            onChange={e => handleOptionChange(idx, "optionText", e.target.value)}
                            required
                        />
                    </div>
                ))}
                <div className="mt-3">
                    <label className="form-label">Selecciona la opción correcta:</label>
                    <div className="d-flex gap-3">
                        {options.map((opt, idx) => (
                            <div key={idx} className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="correctOption"
                                    id={`correctOption${idx}`}
                                    checked={opt.isCorrect}
                                    onChange={() => handleOptionChange(idx, "isCorrect", true)}
                                    required
                                />
                                <label className="form-check-label" htmlFor={`correctOption${idx}`}>
                                    {`Opción ${idx + 1}`}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="d-flex gap-2 mt-3">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar"}
                </button>
            </div>
        </form>
    );
};