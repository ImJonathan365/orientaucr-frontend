import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { GenericForm, FormField } from '../../components/organisms/FormBar/GenericForm';
import { getCourses, addCourse, CourseCreate } from '../../services/courseService';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { getCurrentUser } from '../../services/userService';
import { validateUserPermission } from '../../validations/userPermissionValidation';

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

interface PrereqOrCoreq {
    courseId: string;
}

function normalizeCode(code: string) {
    return code.replace(/-/g, '').toUpperCase().trim();
}

export const NewCoursesPage = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);

    const [selectedPrereqId, setSelectedPrereqId] = useState<string>('');
    const [selectedPrereqSemester, setSelectedPrereqSemester] = useState<number>(1);
    const [prerequisites, setPrerequisites] = useState<PrereqOrCoreq[]>([]);
    const [selectedCoreqId, setSelectedCoreqId] = useState<string>('');
    const [selectedCoreqSemester, setSelectedCoreqSemester] = useState<number>(1);
    const [corequisites, setCorequisites] = useState<PrereqOrCoreq[]>([]);
    const [checkingPermission, setCheckingPermission] = useState(true);

    useEffect(() => {
        const checkPermission = async () => {
            try {
                const user = await getCurrentUser();
                const { canEdit } = validateUserPermission(
                    user,
                    "CREAR CURSOS",
                    "",
                    ""
                );
                if (!canEdit) {
                    await Swal.fire({
                        icon: "warning",
                        title: "Acceso denegado",
                        text: "No tienes permiso para crear cursos.",
                    });
                    navigate("/course-list", { replace: true });
                }
            } catch {
                await Swal.fire("Error", "No se pudo validar tu sesión", "error");
                navigate("/course-list", { replace: true });
            } finally {
                setCheckingPermission(false);
            }
        };
        checkPermission();
    }, [navigate]);

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

    

    const handleAddPrereq = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPrereqId || prerequisites.some(p => p.courseId === selectedPrereqId)) return;
        setPrerequisites([...prerequisites, { courseId: selectedPrereqId }]);
        setSelectedPrereqId('');
        setSelectedPrereqSemester(1);
    };
    const handleRemovePrereq = (courseId: string) => {
        setPrerequisites(prerequisites.filter(p => p.courseId !== courseId));
    };

    const handleAddCoreq = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCoreqId || corequisites.some(c => c.courseId === selectedCoreqId)) return;
        setCorequisites([...corequisites, { courseId: selectedCoreqId }]);
        setSelectedCoreqId('');
        setSelectedCoreqSemester(1);
    };
    const handleRemoveCoreq = (courseId: string) => {
        setCorequisites(corequisites.filter(c => c.courseId !== courseId));
    };

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
                prerequisites: prerequisites.map(p => p.courseId),
                corequisites: corequisites.map(c => c.courseId)
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

    if (checkingPermission) {
        return null; 
    }
    
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
                renderExtraFields={() => (
                    <>
                        {/* Prerrequisitos */}
                        <Form.Group className="mb-3">
                            <Form.Label>Agregar prerrequisito</Form.Label>
                            <Row>
                                <Col md={6}>
                                    <Form.Select
                                        value={selectedPrereqId}
                                        onChange={e => setSelectedPrereqId(e.target.value)}
                                    >
                                        <option value="">Seleccione un curso</option>
                                        {courses
                                            .filter(course => !prerequisites.some(p => p.courseId === course.courseId))
                                            .map(course => (
                                                <option key={course.courseId} value={course.courseId}>
                                                    {course.courseCode} - {course.courseName}
                                                </option>
                                            ))}
                                    </Form.Select>
                                </Col>
                                <Col md={3}>
                                    <Button
                                        variant="primary"
                                        onClick={handleAddPrereq}
                                        disabled={!selectedPrereqId}
                                    >
                                        Agregar
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Group>
                        {prerequisites.length > 0 && (
                            <div className="mb-3">
                                <strong>Prerrequisitos agregados:</strong>
                                <ul className="list-unstyled">
                                    {prerequisites.map(p => {
                                        const course = courses.find(cs => cs.courseId === p.courseId);
                                        return (
                                            <li key={p.courseId} className="mb-2">
                                                {course ? `${course.courseCode} - ${course.courseName}` : p.courseId}
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="ms-2"
                                                    onClick={() => handleRemovePrereq(p.courseId)}
                                                >
                                                    Quitar
                                                </Button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}

                        {/* Correquisitos */}
                        <Form.Group className="mb-3">
                            <Form.Label>Agregar correquisito</Form.Label>
                            <Row>
                                <Col md={6}>
                                    <Form.Select
                                        value={selectedCoreqId}
                                        onChange={e => setSelectedCoreqId(e.target.value)}
                                    >
                                        <option value="">Seleccione un curso</option>
                                        {courses
                                            .filter(course => !corequisites.some(c => c.courseId === course.courseId))
                                            .map(course => (
                                                <option key={course.courseId} value={course.courseId}>
                                                    {course.courseCode} - {course.courseName}
                                                </option>
                                            ))}
                                    </Form.Select>
                                </Col>
                                <Col md={3}>
                                    <Button
                                        variant="primary"
                                        onClick={handleAddCoreq}
                                        disabled={!selectedCoreqId}
                                    >
                                        Agregar
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Group>
                        {corequisites.length > 0 && (
                            <div className="mb-3">
                                <strong>Correquisitos agregados:</strong>
                                <ul className="list-unstyled">
                                    {corequisites.map(c => {
                                        const course = courses.find(cs => cs.courseId === c.courseId);
                                        return (
                                            <li key={c.courseId} className="mb-2">
                                                {course ? `${course.courseCode} - ${course.courseName}` : c.courseId}
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="ms-2"
                                                    onClick={() => handleRemoveCoreq(c.courseId)}
                                                >
                                                    Quitar
                                                </Button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </>
                )}
            />
        </div>
    );
};

