import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { GenericForm, FormField } from '../../components/organisms/FormBar/GenericForm';
import { getCourseById, updateCourse, getCourses } from '../../services/courseService';
import { Course } from '../../types/carrerTypes';

interface EditCourseFormValues {
    courseCode: string;
    courseName: string;
    courseDescription: string;
    courseCredits: number;
    courseIsShared?: boolean;
    courseIsAsigned?: boolean;
    prerequisites: string[];
    corequisites: string[];
}

export const EditCoursePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState<EditCourseFormValues | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) {
                    await Swal.fire({
                        title: 'Error',
                        text: 'No se proporcionó ID de curso',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                    navigate('/course-list');
                    return;
                }
                setIsLoading(true);
                const [courseData, allCourses] = await Promise.all([
                    getCourseById(id),
                    getCourses()
                ]);
                setCourses(allCourses);

                setInitialValues({
                    courseCode: courseData.courseCode,
                    courseName: courseData.courseName,
                    courseDescription: courseData.courseDescription,
                    courseCredits: courseData.courseCredits,
                    courseIsShared: courseData.courseIsShared,
                    prerequisites: courseData.prerequisites || [],
                    corequisites: courseData.corequisites || []
                });
            } catch (error) {
                await Swal.fire({
                    title: 'No encontrado',
                    text: 'No se pudo encontrar el curso solicitado.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
                navigate('/course-list');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const formFields: FormField[] = [
        {
            name: 'courseCode',
            label: 'Código del curso',
            type: 'text',
            required: true,
            placeholder: 'Ingrese el código (ej. MAT101)'
        },
        {
            name: 'courseName',
            label: 'Nombre del curso',
            type: 'text',
            required: true,
            placeholder: 'Ingrese el nombre del curso'
        },
        {
            name: 'courseDescription',
            label: 'Descripción',
            type: 'textarea',
            required: true,
            placeholder: 'Descripción del curso'
        },
        {
            name: 'courseCredits',
            label: 'Créditos',
            type: 'number',
            required: true,
            min: 1,
            max: 18,
            placeholder: 'Cantidad de créditos'
        },
        {
            name: 'courseIsShared',
            label: '¿El curso es compartido?',
            type: 'checkbox',
            required: false
        },
        {
            name: 'prerequisites',
            label: 'Prerrequisitos',
            type: 'checkbox-group',
            required: false,
            options: courses
                .filter(c => c.courseId !== id)
                .map(c => ({
                    value: c.courseId,
                    label: `${c.courseCode} - ${c.courseName}`
                }))
        },
        {
            name: 'corequisites',
            label: 'Correquisitos',
            type: 'checkbox-group',
            required: false,
            options: courses
                .filter(c => c.courseId !== id)
                .map(c => ({
                    value: c.courseId,
                    label: `${c.courseCode} - ${c.courseName}`
                }))
        }
    ];

    function normalizeCode(code: string) {
        return code.replace(/-/g, '').toUpperCase().trim();
    }

    const handleSubmit = async (values: EditCourseFormValues) => {
        try {
            if (!values.courseName || values.courseName.trim().length === 0 ||
                !values.courseDescription || values.courseDescription.trim().length === 0) {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Campos requeridos',
                    text: 'Ningún campo puede estar vacío.',
                    confirmButtonText: 'Aceptar'
                });
                return;
            }

            const code = values.courseCode.trim().toUpperCase();
            const normalizedCode = normalizeCode(code);
            const existingCodes = courses
                .filter(c => c.courseId !== id)
                .map(c => normalizeCode(c.courseCode));


            if (/\s/.test(code)) {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Código inválido',
                    text: 'El código no puede contener espacios.',
                    confirmButtonText: 'Aceptar'
                });
                return;
            }


            if (code.length > 7) {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Código demasiado largo',
                    text: 'El código no puede tener más de 7 caracteres.',
                    confirmButtonText: 'Aceptar'
                });
                return;
            }

            const courseCodeRegex = /^[A-Z]{2}[A-Z0-9-]*$/;
            if (!courseCodeRegex.test(code)) {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Formato inválido',
                    text: 'El código debe comenzar con 2 letras mayúsculas y puede contener letras, números o guiones.',
                    confirmButtonText: 'Aceptar'
                });
                return;
            }

            if (existingCodes.includes(normalizedCode)) {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Código duplicado',
                    text: 'Ya existe un curso con ese código.',
                    confirmButtonText: 'Aceptar'
                });
                return;
            }

            const creditsStr = String(values.courseCredits);
            if (!/^[1-9][0-9]*$/.test(creditsStr)) {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Créditos inválidos',
                    text: 'La cantidad de créditos debe ser un número entero positivo sin ceros a la izquierda.',
                    confirmButtonText: 'Aceptar'
                });
                return;
            }

            if (values.courseIsShared) {
                values.courseIsAsigned = false;
            }
            await updateCourse({
                courseId: id!,
                courseCode: values.courseCode.trim(),
                courseName: values.courseName.trim(),
                courseDescription: values.courseDescription.trim(),
                courseCredits: values.courseCredits,
                courseIsShared: false,
                courseIsAsigned: false,
                prerequisites: values.prerequisites,
                corequisites: values.corequisites,
                courseSemester: 0
            });

            await Swal.fire({
                icon: 'success',
                title: 'Curso actualizado',
                text: 'El curso se actualizó correctamente.',
                confirmButtonText: 'Aceptar'
            });

            navigate('/course-list');
        } catch (error) {
            console.error('Error al actualizar curso:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el curso, intenta nuevamente.',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    if (isLoading || !initialValues) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <span className="spinner-border text-primary" role="status" />
                <span className="ms-2">Cargando información del curso...</span>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <h2 className="mb-4">Editar Curso</h2>
            <GenericForm<EditCourseFormValues>
                title=""
                initialValues={initialValues}
                fields={formFields}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/course-list')}
                submitText="Guardar Cambios"
                cancelText="Cancelar"
            />
        </div>
    );
};