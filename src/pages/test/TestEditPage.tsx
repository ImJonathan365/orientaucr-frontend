import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Test } from "../../types/testType";
import { getTestById, updateTest } from "../../services/testService";
import { getAllCharacteristics } from "../../services/characteristicService";

export const TestEditPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [test, setTest] = useState<Test | null>(null);
    const [loading, setLoading] = useState(true);
    const [characteristics, setCharacteristics] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [testData, allCharacteristics] = await Promise.all([
                    getTestById(id!),
                    getAllCharacteristics()
                ]);
                setTest(testData);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!test) return;
        const { name, value } = e.target;
        setTest({ ...test, [name]: value });
    };

    const handleAddCharacteristic = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!test) return;
        const selectedCharacteristicId = e.target.value;
        const selectedCharacteristic = characteristics.find(
            (c) => c.characteristics_id === selectedCharacteristicId
        );
        if (
            selectedCharacteristic &&
            !test.characteristics.some((c) => c.characteristics_id === selectedCharacteristicId)
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
                (c) => c.characteristics_id !== characteristicId
            ),
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!test) return;
        try {
            await updateTest(test);
            alert("Pregunta actualizada correctamente");
            navigate("/test-list");
        } catch (error) {
            alert("Error al actualizar la pregunta");
        }
    };

    if (loading) {
        return <div className="container py-4"><p>Cargando...</p></div>;
    }

    if (!test) {
        return <div className="container py-4"><p>No se encontró la pregunta.</p></div>;
    }

    return (
        <div className="container py-4">
            <h2 className="mb-4">Editar Pregunta</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="question_text" className="form-label">Pregunta</label>
                    <input
                        type="text"
                        className="form-control"
                        id="question_text"
                        name="question_text"
                        value={test.question_text}
                        onChange={handleChange}
                    />
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
                                        (tc) => tc.characteristics_id === c.characteristics_id
                                    )
                            )
                            .map((c) => (
                                <option key={c.characteristics_id} value={c.characteristics_id}>
                                    {c.characteristics_name}
                                </option>
                            ))}
                    </select>
                </div>
                <ul className="list-group mb-3">
                    {test.characteristics.map((c) => (
                        <li key={c.characteristics_id} className="list-group-item d-flex justify-content-between align-items-center">
                            {c.characteristics_name}
                            <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => handleRemoveCharacteristic(c.characteristics_id)}
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
                <button type="submit" className="btn btn-primary">Guardar Cambios</button>
            </form>
        </div>
    );
};