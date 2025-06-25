import React, { useState, useEffect } from "react";
import { SimulationQuestion, SimulationOption, Difficulty } from "../../../types/SimulationQuestion";
import { Category } from "../../../types/Category";
import { getAllCategories } from "../../../services/Category";
import Swal from "sweetalert2";

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

function normalizeOptionText(text: string) {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^[¿?]+/, "")
    .replace(/[¿?]+$/, "")
    .replace(/\s+/g, " ");
}

const isValidOption = (text: string) => {
  const trimmed = text.trim();
  return trimmed.length > 0 && /[a-zA-Z0-9]/.test(trimmed);
};

export const SimulationQuestionForm: React.FC<Props> = ({ initial, onSubmit, loading }) => {
  const [questionText, setQuestionText] = useState(initial?.questionText ?? "");
  const [difficulty, setDifficulty] = useState<Difficulty>(initial?.difficulty ?? "medium");
  const [options, setOptions] = useState<SimulationOption[]>(
    initial?.options && initial.options.length === 4 ? initial.options : defaultOptions
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    initial?.categories?.[0]?.categoryId || ""
  );

  useEffect(() => {
    setQuestionText(initial?.questionText ?? "");
    setDifficulty(initial?.difficulty ?? "medium");
    setOptions(initial?.options && initial.options.length === 4 ? initial.options : defaultOptions);
    setSelectedCategoryId(initial?.categories?.[0]?.categoryId || "");
  }, [initial]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
        Swal.fire("Error", "No se pudieron cargar las categorías.", "error");
      }
    };
    fetchCategories();
  }, []);

  const handleOptionChange = (idx: number, field: keyof SimulationOption, value: any) => {
    setOptions((opts) =>
      field === "isCorrect"
        ? opts.map((opt, i) => ({ ...opt, isCorrect: i === idx ? value : false }))
        : opts.map((opt, i) => (i === idx ? { ...opt, [field]: value } : opt))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    for (let i = 0; i < options.length; i++) {
      if (!isValidOption(options[i].optionText)) {
        Swal.fire(
          "Error",
          `La opción ${i + 1} debe contener al menos una letra o número.`,
          "warning"
        );
        return;
      }
    }

    const normalizedOptions = options.map((opt) => normalizeOptionText(opt.optionText));
    const uniqueOptions = new Set(normalizedOptions);
    if (uniqueOptions.size !== normalizedOptions.length) {
      Swal.fire("Error", "No puede haber opciones repetidas.", "warning");
      return;
    }

    if (!options.some((opt) => opt.isCorrect)) {
      Swal.fire("Error", "Debe marcar una opción como correcta.", "warning");
      return;
    }

    if (!selectedCategoryId) {
      Swal.fire("Error", "Debe seleccionar una categoría.", "warning");
      return;
    }

    const selectedCategoryObjects = categories.filter(
      (cat) => cat.categoryId === selectedCategoryId
    );

    onSubmit({
      questionId: initial?.questionId || "",
      questionText,
      difficulty,
      options,
      categories: selectedCategoryObjects,
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
          onChange={(e) => setQuestionText(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Categoría</label>
        <select
          className="form-select"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          required
        >
          <option value="">Seleccione una categoría</option>
          {categories.map((cat) => (
            <option key={cat.categoryId} value={cat.categoryId}>
              {cat.categoryName}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Dificultad</label>
        <select
          className="form-select"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          required
        >
          <option value="easy">Fácil</option>
          <option value="medium">Media</option>
          <option value="hard">Difícil</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Opciones:</label>
        {options.map((opt, idx) => (
          <div className="mb-2" key={idx}>
            <input
              type="text"
              className="form-control"
              placeholder={`Opción ${idx + 1}`}
              value={opt.optionText}
              onChange={(e) => handleOptionChange(idx, "optionText", e.target.value)}
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
