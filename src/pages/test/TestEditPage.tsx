import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Test } from "../../types/testType";
import { getTestById, updateTest } from "../../services/testService";
import { getAllCharacteristics } from "../../services/characteristicService";
import { Characteristic } from "../../types/carrerTypes";
import { Button } from "../../components/atoms/Button/Button";
import Swal from "sweetalert2";

export const TestEditPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [test, setTest] = useState<Test | null>(null);
    const [loading, setLoading] = useState(true);
    const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [testData, allCharacteristics] = await Promise.all([
                    getTestById(id!),
                    getAllCharacteristics()
                ]);
                setTest({
                    ...testData,
                    questionHelpText: testData.questionHelpText || "",
                });
                setCharacteristics(allCharacteristics);
            } catch {
                setTest(null);
                setCharacteristics([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!test) return;
        const { name, value, type } = e.target;
        if (type === "checkbox" && e.target instanceof HTMLInputElement) {
            setTest({ ...test, [name]: (e.target as HTMLInputElement).checked });
        } else {
            setTest({ ...test, [name]: value });
        }
    };

    const handleAddCharacteristic = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!test) return;
        const selectedCharacteristicId = e.target.value;
        const selectedCharacteristic = characteristics.find(
            (c) => c.characteristicsId === selectedCharacteristicId
        );
        if (
            selectedCharacteristic &&
            !test.characteristics.some((c) => c.characteristicsId === selectedCharacteristic.characteristicsId)
        ) {
            setTest({
                ...test,
                characteristics: [...test.characteristics, selectedCharacteristic],
            });
        }
    };

    const handleRemoveCharacteristic = (characteristicId: string) => {
        if (!test) return;
        setTest({
            ...test,
            characteristics: test.characteristics.filter(
                (c) => c.characteristicsId !== characteristicId
            ),
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        if (!test) return;
        if (!test.questionText.trim()) {
            await Swal.fire({
                icon: "error",
                title: "Pregunta obligatoria",
                text: "La pregunta es obligatoria.",
                confirmButtonText: "Aceptar"
            });
            setLoading(false);
            return;
        }
        if (test.characteristics.length === 0) {
            await Swal.fire({
                icon: "error",
                title: "Características requeridas",
                text: "Debe agregar al menos una característica.",
                confirmButtonText: "Aceptar"
            });
            setLoading(false);
            return;
        }
        try {
            await updateTest(test);
            await Swal.fire({
                icon: "success",
                title: "Pregunta actualizada correctamente",
                confirmButtonText: "Aceptar"
            });
            navigate("/test-list");
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al actualizar la pregunta",
                confirmButtonText: "Aceptar"
            });
        } finally {
            setLoading(false);
        }
    };

    if (!test) {
        return <div className="container py-4"><p>No se encontró la pregunta.</p></div>;
    }

    return (
        <div className="container py-4">
            <h2 className="mb-4">Editar Pregunta</h2>
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
                        Activa
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
                        Permitir selección múltiple
                    </label>
                </div>
                <div className="mb-3">
                    <label htmlFor="characteristics" className="form-label">Agregar Característica</label>
                    <select
                        className="form-select"
                        id="characteristics"
                        onChange={handleAddCharacteristic}
                        value=""
                    >
                        <option value="" disabled>Seleccione una característica</option>
                        {characteristics
                            .filter(
                                (c) =>
                                    !test.characteristics.some(
                                        (tc) => tc.characteristicsId === c.characteristicsId
                                    )
                            )
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