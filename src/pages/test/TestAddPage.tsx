import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Test } from "../../types/testType";
import { addTest } from "../../services/testService";
import { getAllCharacteristics } from "../../services/characteristicService";

export const TestAddPage = () => {
    const navigate = useNavigate();
    const [test, setTest] = useState<Test>({
        question_id: "",
        question_text: "",
        characteristics: [],
    });
    const [loading, setLoading] = useState(true);
    const [characteristics, setCharacteristics] = useState<any[]>([]);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTest({ ...test, [name]: value });
    };

    const handleAddCharacteristic = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCharacteristicId = e.target.value;
        const selectedCharacteristic = characteristics.find(c => c.characteristics_id === selectedCharacteristicId);
        if (selectedCharacteristic) {
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
        try {
            await addTest(test);
            alert("Pregunta añadida correctamente");
            navigate("/test-list");
        } catch (error) {
            alert("Error al añadir la pregunta");
        }
    };
    return (
        <div className="container py-4">
            <h2 className="mb-4">Añadir Pregunta</h2>
            {loading ? (
                <p>Cargando...</p>
            ) : (
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
                        <label htmlFor="characteristics" className="form-label">Características</label>
                        <select
                            className="form-select"
                            id="characteristics"
                            onChange={handleAddCharacteristic}
                        >
                            {characteristics.map((c) => (
                                <option key={c.characteristics_id} value={c.characteristics_id}>
                                    {c.characteristics_name}
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
                    <button type="submit" className="btn btn-primary">Añadir Pregunta</button>
                </form>
            )}
        </div>
    );
}
