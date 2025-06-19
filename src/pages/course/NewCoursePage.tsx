import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { GenericForm, FormField } from '../../components/organisms/FormBar/GenericForm';
import { getCourses, addCourse, CourseCreate } from '../../services/courseService';

interface Course {
    courseId: string;
    courseCode: string;
    courseName: string;
}

interface NewCourseFormValues {
    courseCode: string;
    courseName: string;
    courseDescription: string;
    credits: number;
    courseIsShared: boolean;
    prerequisites: string[];
    corequisites: string[];
}

function normalizeCode(code: string) {
    return code.replace(/-/g, '').toUpperCase().trim();
}

export const NewCoursesPage = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getCourses();
                setCourses(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

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
            name: 'credits',
            label: 'Créditos',
            type: 'number',
            required: true,
            min: 0,
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
            options: courses.map(c => ({
                value: c.courseId,
                label: `${c.courseCode} - ${c.courseName}`
            }))
        },
        {
            name: 'corequisites',
            label: 'Correquisitos',
            type: 'checkbox-group',
            required: false,
            options: courses.map(c => ({
                value: c.courseId,
                label: `${c.courseCode} - ${c.courseName}`
            }))
        }
    ];

    const handleSubmit = async (values: NewCourseFormValues) => {
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
            const existingCodes = courses.map(c => normalizeCode(c.courseCode));

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

            const creditsStr = String(values.credits);
            if (!/^[1-9][0-9]*$/.test(creditsStr)) {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Créditos inválidos',
                    text: 'La cantidad de créditos debe ser un número entero positivo sin ceros a la izquierda.',
                    confirmButtonText: 'Aceptar'
                });
                return;
            }

            const payload = {
                courseCode: values.courseCode.trim(),
                courseName: values.courseName.trim(),
                courseDescription: values.courseDescription.trim(),
                courseCredits: values.credits,
                courseIsShared: values.courseIsShared || false,
                prerequisites: values.prerequisites,
                corequisites: values.corequisites 
            };

            await addCourse(payload);

            await Swal.fire({
                icon: 'success',
                title: 'Curso creado',
                text: 'El curso se creó correctamente.',
                confirmButtonText: 'Aceptar'
            });

            navigate('/course-list');
        } catch (error) {
            console.error('Error al guardar curso:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo guardar el curso, intenta nuevamente.',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    const handleCancel = () => {
        navigate('/course-list');
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">Nuevo Curso</h2>
            <GenericForm<NewCourseFormValues>
                title=""
                initialValues={{
                    courseCode: '',
                    courseName: '',
                    courseDescription: '',
                    credits: 3,
                    courseIsShared: false, 
                    prerequisites: [],
                    corequisites: []
                }}
                fields={formFields}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                submitText="Crear Curso"
            />
        </div>
    );
};

