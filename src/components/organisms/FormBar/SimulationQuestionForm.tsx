import React, { useState, useEffect } from "react";
import { SimulationQuestion, SimulationOption } from "../../../types/SimulationQuestion";
import { SimulationOptionInput } from "../../atoms/Input/SimulationOptionInput";

interface Props {
    initial?: SimulationQuestion;
    onSubmit: (q: SimulationQuestion) => void;
    loading?: boolean;
}

export const SimulationQuestionForm: React.FC<Props> = ({ initial, onSubmit, loading }) => {
    const [questionText, setQuestionText] = useState(initial?.questionText ?? "");
    const [questionCategory, setQuestionCategory] = useState(initial?.questionCategory ?? "");
    const [options, setOptions] = useState<SimulationOption[]>(initial?.options ?? []);

    // Sincroniza el estado cuando initial cambie (por ejemplo, al editar)
    useEffect(() => {
        setQuestionText(initial?.questionText ?? "");
        setQuestionCategory(initial?.questionCategory ?? "");
        setOptions(initial?.options ?? []);
    }, [initial]);

    // Solo una opción puede ser correcta
    const handleOptionChange = (idx: number, field: keyof SimulationOption, value: any) => {
        setOptions(opts =>
            field === "isCorrect"
                ? opts.map((opt, i) => ({ ...opt, isCorrect: i === idx ? value : false }))
                : opts.map((opt, i) => i === idx ? { ...opt, [field]: value } : opt)
        );
        console.log("Cambio opción", idx, field, value);
    };

    const handleAddOption = () => {
        setOptions([...options, { optionId: "", optionText: "", isCorrect: false }]);
    };

    const handleRemoveOption = (idx: number) => {
        setOptions(opts => opts.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (options.length < 2) {
            alert("Debe agregar al menos dos opciones.");
            return;
        }
        if (!options.some(opt => opt.isCorrect)) {
            alert("Debe marcar una opción como correcta.");
            return;
        }
        console.log("Opciones al enviar (definitivo):", options);
        onSubmit({
            questionId: initial?.questionId || "",
            questionText,
            questionCategory,
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
                <div className="d-flex align-items-center gap-2 mb-2">
                    <label className="form-label mb-0">Opciones:</label>
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={handleAddOption}
                    >
                        Agregar opción
                    </button>
                </div>
                {options.map((opt, idx) => (
                    <SimulationOptionInput
                        key={idx}
                        value={opt.optionText || ""}
                        isCorrect={!!opt.isCorrect}
                        onChangeText={text => handleOptionChange(idx, "optionText", text)}
                        onChangeCorrect={checked => handleOptionChange(idx, "isCorrect", checked)}
                        onRemove={() => handleRemoveOption(idx)}
                        name="correctOptionGroup" // <-- mismo nombre para todas
                    />
                ))}
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Guardando..." : "Guardar"}
            </button>
        </form>
    );
};