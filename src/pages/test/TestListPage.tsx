import { useEffect, useState } from "react";
import { getAllTests, deleteTest } from "../../services/testService";
import { Test } from "../../types/testType";
import { Table, TableColumn } from "../../components/organisms/Tables/Table";
import { useNavigate, Link } from "react-router-dom";

export const TestListPage = () => {
    const navigate = useNavigate();
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const data = await getAllTests();
                setTests(data);
            } catch {
                setTests([]);
            } finally {
                setLoading(false);
            }
        };
        fetchTests();
    }, []);

    const handleEdit = (test: Test) => {
        if (window.confirm(`¿Deseas editar la pregunta: ${test.question_text}?`)) {
            navigate(`/test-list/edit/${test.question_id}`);
        }
    };

    const handleDelete = async (test: Test) => {
        if (window.confirm("¿Seguro que deseas eliminar esta pregunta?")) {
            await deleteTest(test.question_id);
            setTests(tests.filter(t => t.question_id !== test.question_id));
        }
    };

    const columns: TableColumn<Test>[] = [
        {
            key: "question_text",
            label: "Pregunta",
            render: (row) => row.question_text,
        },
        {
            key: "characteristics",
            label: "Características",
            render: (row) => (
                <select className="form-select">
                    {row.characteristics.map((c) => (
                        <option key={c.characteristics_id}>{c.characteristics_name}</option>
                    ))}
                </select>
            ),
        },
    ];

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mt-4">
                <h2 className="mb-4">Preguntas del Test</h2>
                <Link to="/test-list/add" className="btn btn-primary mb-4">
                    Añadir Pregunta
                </Link>
            </div>
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <Table
                    columns={columns}
                    data={tests}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};