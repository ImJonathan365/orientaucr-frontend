// src/pages/EditCareerPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GenericForm } from '../../components/organisms/FormBar/GenericForm';
import { getCareerById, updateCareer, getCareers } from '../../services/careerService';
import { FormField } from '../../components/organisms/FormBar/GenericForm';
import { Career, Characteristic } from '../../types/carrerTypes';
import { Alert, Spinner } from 'react-bootstrap';
import Swal from "sweetalert2";
import { getAllCharacteristics } from '../../services/characteristicService';

export const EditCareerPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState<any>({
        careerName: '',
        careerDescription: '',
        careerDurationYears: 4,
        characteristics: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [allCharacteristics, setAllCharacteristics] = useState<Characteristic[]>([]);

    useEffect(() => {
        const fetchCharacteristics = async () => {
            try {
                const data = await getAllCharacteristics(); // Este servicio debe darte todas las opciones
                setAllCharacteristics(data);
            } catch (error) {
                console.error('Error al cargar características:', error);
            }
        };

        fetchCharacteristics();
    }, []);

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
                if (!data || !data.careerId) {
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
                    careerId: data.careerId,
                    careerName: data.careerName,
                    careerDescription: data.careerDescription,
                    careerDurationYears: data.careerDurationYears,
                    characteristics: data.characteristics?.map(c => c.characteristicsId) || []

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


    function normalizeString(str: string): string {
        return str
            .normalize('NFD') // separa acentos
            .replace(/[\u0300-\u036f]/g, '') // elimina acentos
            .replace(/\s+/g, '') // elimina todos los espacios
            .toLowerCase(); // todo a minúsculas
    }

    const handleSubmit = async (formData: Partial<Career>) => {
        if (!id) {
            setError('ID de carrera no válido');
            return;
        }

        const regex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑüÜ]+$/;

        if (!regex.test(formData.careerName || '')) {
            Swal.fire({
                title: 'Caracteres no permitidos',
                text: 'El nombre no debe contener caracteres especiales. Solo letras, números y espacios.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }
        const existingCareers = await getCareers();
        const normalizedNewName = normalizeString(formData.careerName || '');
        const isDuplicate = existingCareers.some(c => {
            if (c.careerId === id) return false;
            return normalizeString(c.careerName) === normalizedNewName;
        });

        if (isDuplicate) {
            Swal.fire({
                title: 'Nombre ya existe',
                text: 'Ya existe una carrera con ese nombre (ignorando tildes y espacios).',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
            });
            setIsLoading(false);
            return;
        }


        try {
            setIsLoading(true);
            await updateCareer({
                ...formData,
                careerId: id,
                characteristics: (formData.characteristics || []).map(charId => ({
                    characteristicsId: charId
                }))
            } as unknown as Career);
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
            name: 'careerName',
            label: 'Nombre de la carrera',
            type: 'text',
            required: true,
            placeholder: 'Ej: Ingeniería en Sistemas'
        },
        {
            name: 'careerDescription',
            label: 'Descripción',
            type: 'textarea',
            required: true,
            placeholder: 'Descripción detallada de la carrera'
        },
        {
            name: 'careerDurationYears',
            label: 'Duración (años)',
            type: 'number',
            required: true,
            min: 1,
            max: 10,
            placeholder: 'Ej: 4'
        },
        {
            name: 'characteristics',
            label: 'Características de la carrera',
            type: 'checkbox-group',
            options: allCharacteristics
                .sort((a, b) => a.characteristicsName.localeCompare(b.characteristicsName))
                .map(c => ({ label: c.characteristicsName, value: c.characteristicsId })),
            required: false
        }
    ];

    if (isLoading && !initialValues.careerName) {
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