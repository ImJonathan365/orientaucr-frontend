import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Test } from "../../types/testType";
import { addTest } from "../../services/testService";
import { getAllCharacteristics } from "../../services/characteristicService";
import { Characteristic } from "../../types/carrerTypes";
import { Button } from "../../components/atoms/Button/Button";
import { validateTestForm } from "../../validations/test/testFormValidation";
import Swal from "sweetalert2";

export const TestAddPage = () => {
    const navigate = useNavigate();
    const [test, setTest] = useState<Test>({
        questionId: "",
        questionText: "",
        questionHelpText: "",
        isActive: true,
        isMultipleSelection: false,
        characteristics: [],
    });
    const [loading, setLoading] = useState(true);
    const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);

    useEffect(() => {
        const fetchCharacteristics = async () => {
            try {
                const data = await getAllCharacteristics();
                setCharacteristics(data);
            } catch {
                setCharacteristics([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCharacteristics();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        if (type === "checkbox" && e.target instanceof HTMLInputElement) {
            setTest(prev => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked
            }));
        } else {
            setTest(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleAddCharacteristic = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCharacteristicId = e.target.value;
        const selectedCharacteristic = characteristics.find(
            c => c.characteristicsId === selectedCharacteristicId
        );
        if (
            selectedCharacteristic &&
            !test.characteristics.some(c => c.characteristicsId === selectedCharacteristic.characteristicsId)
        ) {
            setTest({
                ...test,
                characteristics: [...test.characteristics, selectedCharacteristic],
            });
        }
    };

    const handleRemoveCharacteristic = (characteristicId: string) => {
        setTest({
            ...test,
            characteristics: test.characteristics.filter(c => c.characteristicsId !== characteristicId),
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const validation = validateTestForm({
            questionText: test.questionText,
            questionHelpText: test.questionHelpText ?? "",
            characteristics: test.characteristics,
        });
        if (!validation.valid) {
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: validation.message,
                confirmButtonText: "Aceptar"
            });
            setLoading(false);
            return;
        }
        try {
            await addTest(test);
            await Swal.fire({
                icon: "success",
                title: "Pregunta añadida correctamente",
                confirmButtonText: "Aceptar"
            });
            navigate("/test-list");
        } catch (error: any) {
            const backendMsg = error.response?.data || error.message || "Error al añadir la pregunta";
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: backendMsg,
                confirmButtonText: "Aceptar"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">Añadir Pregunta</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="questionText" className="form-label">Pregunta</label>
                    <input
                        type="text"
                        className="form-control"
                        id="questionText"
                        name="questionText"
                        value={test.questionText}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="questionHelpText" className="form-label">Texto de ayuda (opcional)</label>
                    <textarea
                        className="form-control"
                        id="questionHelpText"
                        name="questionHelpText"
                        value={test.questionHelpText}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="isActive"
                        name="isActive"
                        checked={test.isActive}
                        onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="isActive">
                        ¿Estará activa?
                    </label>
                </div>
                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="isMultipleSelection"
                        name="isMultipleSelection"
                        checked={test.isMultipleSelection}
                        onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="isMultipleSelection">
                        ¿Permite selección múltiple?
                    </label>
                </div>
                <div className="mb-3">
                    <label htmlFor="characteristics" className="form-label">Características</label>
                    <select
                        className="form-select"
                        id="characteristics"
                        onChange={handleAddCharacteristic}
                        value=""
                    >
                        <option value="" disabled>
                            Selecciona una característica
                        </option>
                        {characteristics
                            .filter(c => !test.characteristics.some(tc => tc.characteristicsId === c.characteristicsId))
                            .map((c) => (
                                <option key={c.characteristicsId} value={c.characteristicsId}>
                                    {c.characteristicsName}
                                </option>
                            ))}
                    </select>
                </div>
                <ul className="list-group mb-3">
                    {test.characteristics.map((c) => (
                        <li key={c.characteristicsId} className="list-group-item d-flex justify-content-between align-items-center">
                            {c.characteristicsName}
                            <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => handleRemoveCharacteristic(c.characteristicsId)}
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="d-flex gap-2">
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? "Guardando..." : "Guardar"}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => navigate('/test-list')}>
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
};