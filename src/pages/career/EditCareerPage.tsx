// src/pages/EditCareerPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GenericForm } from '../../components/organisms/FormBar/GenericForm';
import { getCareerById, updateCareer } from '../../services/careerService';
import { FormField } from '../../components/organisms/FormBar/GenericForm';
import { Career } from '../../types/careerTypes';
import { Alert, Spinner } from 'react-bootstrap';
import Swal from "sweetalert2";

export const EditCareerPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState<Partial<Career>>({
        career_name: '',
        career_description: '',
        career_duration_years: 4
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCareerData = async () => {
            if (!id) {
                setIsLoading(false);
                await Swal.fire({
                    title: 'Error',
                    text: 'No se proporcionó ID de carrera',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
                navigate('/career-list');
                return;
            }

            try {
                setIsLoading(true);
                const data = await getCareerById(id);
                if (!data || !data.career_id) {
                    await Swal.fire({
                        title: 'No encontrado',
                        text: 'No se pudo encontrar la carrera solicitada.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                    navigate('/career-list');
                    return;
                }
                setInitialValues({
                    career_id: data.career_id,
                    career_name: data.career_name,
                    career_description: data.career_description,
                    career_duration_years: data.career_duration_years
                });
            } catch (err: any) {
                await Swal.fire({
                    title: 'No encontrado',
                    text: 'No se pudo encontrar la carrera solicitada.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
                navigate('/career-list');
            } finally {
                setIsLoading(false);
            }
        };

        loadCareerData();
    }, [id, navigate]);

    const handleSubmit = async (formData: Partial<Career>) => {
        if (!id) {
            setError('ID de carrera no válido');
            return;
        }

        try {
            setIsLoading(true);
            await updateCareer({
                ...formData,
                career_id: id
            } as Career);
            Swal.fire({
                title: 'Éxito',
                text: 'La carrera se ha actualizado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
            navigate('/career-list', {
                state: { success: true, message: 'Carrera actualizada exitosamente' }
            });
        } catch (err) {
            console.error('Error al actualizar carrera:', err);
            setError('Error al guardar los cambios. Por favor intente nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const formFields: FormField[] = [

        {
            name: 'career_name',
            label: 'Nombre de la carrera',
            type: 'text',
            required: true,
            placeholder: 'Ej: Ingeniería en Sistemas'
        },
        {
            name: 'career_description',
            label: 'Descripción',
            type: 'textarea',
            required: true,
            placeholder: 'Descripción detallada de la carrera'
        },
        {
            name: 'career_duration_years',
            label: 'Duración (años)',
            type: 'number',
            required: true,
            min: 1,
            max: 10,
            placeholder: 'Ej: 4'
        }
    ];

    if (isLoading && !initialValues.career_name) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" variant="primary" />
                <span className="ms-2">Cargando información de la carrera...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <Alert variant="danger">
                    <Alert.Heading>Error</Alert.Heading>
                    <p>{error}</p>
                    <hr />
                    <div className="d-flex justify-content-end">
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => navigate('/career-list')}
                        >
                            Volver al listado
                        </button>
                    </div>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <h2 className="mb-4">Editar Carrera</h2>
            <GenericForm
                title=""
                initialValues={initialValues}
                fields={formFields}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/career-list')}
                submitText="Guardar Cambios"
                cancelText="Cancelar"
            />
        </div>
    );
};