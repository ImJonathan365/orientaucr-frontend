import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { GenericForm, FormField } from '../../components/organisms/FormBar/GenericForm';
import { getCourseById, updateCourse, getCourses } from '../../services/courseService';
import { Course } from '../../types/carrerTypes';
import { Form, Row, Col, Button } from 'react-bootstrap';

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
    const [selectedPrereqId, setSelectedPrereqId] = useState<string>('');
    const [prerequisites, setPrerequisites] = useState<string[]>([]);
    const [selectedCoreqId, setSelectedCoreqId] = useState<string>('');
    const [corequisites, setCorequisites] = useState<string[]>([]);

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
                setPrerequisites(courseData.prerequisites || []);
                setCorequisites(courseData.corequisites || []);

                setInitialValues({
                    courseCode: courseData.courseCode,
                    courseName: courseData.courseName,
                    courseDescription: courseData.courseDescription,
                    courseCredits: courseData.courseCredits,
                    courseIsShared: courseData.courseIsShared,
                    courseIsAsigned: courseData.courseIsAsigned,
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
        }
    ];

    function normalizeCode(code: string) {
        return code.replace(/-/g, '').toUpperCase().trim();
    }

    const handleAddPrereq = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPrereqId || prerequisites.includes(selectedPrereqId)) return;
        setPrerequisites([...prerequisites, selectedPrereqId]);
        setSelectedPrereqId('');
    };
    const handleRemovePrereq = (courseId: string) => {
        setPrerequisites(prerequisites.filter(id => id !== courseId));
    };


    const handleAddCoreq = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCoreqId || corequisites.includes(selectedCoreqId)) return;
        setCorequisites([...corequisites, selectedCoreqId]);
        setSelectedCoreqId('');
    };
    const handleRemoveCoreq = (courseId: string) => {
        setCorequisites(corequisites.filter(id => id !== courseId));
    };

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

            const originalIsShared = initialValues?.courseIsShared;
            const originalIsAsigned = initialValues?.courseIsAsigned;
            if (originalIsShared && !values.courseIsShared && originalIsAsigned) {
                await Swal.fire({
                    icon: 'warning',
                    title: 'No permitido',
                    text: 'No puedes marcar como NO compartido un curso que ya está asignado, primero elimine las relaciones.',
                    confirmButtonText: 'Aceptar'
                });
                return;
            }
            if (originalIsShared && !values.courseIsShared) {
                values.courseIsAsigned = false;
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

            
            await updateCourse({
                courseId: id!,
                courseCode: values.courseCode.trim(),
                courseName: values.courseName.trim(),
                courseDescription: values.courseDescription.trim(),
                courseCredits: values.courseCredits,
                courseIsShared: values.courseIsShared ?? false,
                courseIsAsigned: values.courseIsAsigned ?? initialValues?.courseIsAsigned ?? false,
                prerequisites,
                corequisites,
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
                renderExtraFields={() => (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>Agregar prerrequisito</Form.Label>
                            <Row>
                                <Col md={8}>
                                    <Form.Select
                                        value={selectedPrereqId}
                                        onChange={e => setSelectedPrereqId(e.target.value)}
                                    >
                                        <option value="">Seleccione un curso</option>
                                        {courses
                                            .filter(course => course.courseId !== id && !prerequisites.includes(course.courseId))
                                            .map(course => (
                                                <option key={course.courseId} value={course.courseId}>
                                                    {course.courseCode} - {course.courseName}
                                                </option>
                                            ))}
                                    </Form.Select>
                                </Col>
                                <Col md={4}>
                                    <Button
                                        variant="primary"
                                        onClick={handleAddPrereq}
                                        disabled={!selectedPrereqId}
                                    >
                                        Agregar
                                    </Button>
                                </Col>
                            </Row>
                            {prerequisites.length > 0 && (
                                <div className="mt-2">
                                    <strong>Prerrequisitos agregados:</strong>
                                    <ul className="list-unstyled">
                                        {prerequisites.map(pid => {
                                            const course = courses.find(cs => cs.courseId === pid);
                                            return (
                                                <li key={pid} className="mb-2">
                                                    {course ? `${course.courseCode} - ${course.courseName}` : pid}
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        className="ms-2"
                                                        onClick={() => handleRemovePrereq(pid)}
                                                    >
                                                        Quitar
                                                    </Button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Agregar correquisito</Form.Label>
                            <Row>
                                <Col md={8}>
                                    <Form.Select
                                        value={selectedCoreqId}
                                        onChange={e => setSelectedCoreqId(e.target.value)}
                                    >
                                        <option value="">Seleccione un curso</option>
                                        {courses
                                            .filter(course => course.courseId !== id && !corequisites.includes(course.courseId))
                                            .map(course => (
                                                <option key={course.courseId} value={course.courseId}>
                                                    {course.courseCode} - {course.courseName}
                                                </option>
                                            ))}
                                    </Form.Select>
                                </Col>
                                <Col md={4}>
                                    <Button
                                        variant="primary"
                                        onClick={handleAddCoreq}
                                        disabled={!selectedCoreqId}
                                    >
                                        Agregar
                                    </Button>
                                </Col>
                            </Row>
                            {corequisites.length > 0 && (
                                <div className="mt-2">
                                    <strong>Correquisitos agregados:</strong>
                                    <ul className="list-unstyled">
                                        {corequisites.map(cid => {
                                            const course = courses.find(cs => cs.courseId === cid);
                                            return (
                                                <li key={cid} className="mb-2">
                                                    {course ? `${course.courseCode} - ${course.courseName}` : cid}
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        className="ms-2"
                                                        onClick={() => handleRemoveCoreq(cid)}
                                                    >
                                                        Quitar
                                                    </Button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </Form.Group>
                    </>
                )}
            />
        </div>
    );
};