import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenericForm } from '../../components/organisms/FormBar/GenericForm';
import { addCareer, getCoursesForCurricula, addCourseToCareer } from '../../services/careerService';
import { getAllCharacteristics } from '../../services/characteristicService';
import { FormField } from '../../components/organisms/FormBar/GenericForm';
import Swal from "sweetalert2";
import { Form, Row, Col, Button } from 'react-bootstrap';

interface Characteristic {
  characteristicsId: string;
  characteristicsName: string;
}

interface Course {
  courseId: string;
  courseCode: string;
  courseName: string;
}

interface SelectedCourse {
  courseId: string;
  semester: number;
}

interface CareerFormValues {
  careerId: string;
  careerName: string;
  careerDescription: string;
  careerDurationYears: number;
  characteristics: string[]; // IDs
  courses: SelectedCourse[];
}

export const NewCareerPage = () => {
  const navigate = useNavigate();
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<SelectedCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<number>(1);

  useEffect(() => {
    getAllCharacteristics().then((data) => {
      setCharacteristics(Array.isArray(data) ? data : []);
    });
    getCoursesForCurricula('all').then((data) => {
      setCourses(Array.isArray(data) ? data as Course[] : []);
    });
  }, []);

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || selectedCourses.some(c => c.courseId === selectedCourseId)) return;
    setSelectedCourses([
      ...selectedCourses,
      { courseId: selectedCourseId, semester: selectedSemester }
    ]);
    setSelectedCourseId('');
    setSelectedSemester(1);
  };

  const handleRemoveCourse = (courseId: string) => {
    setSelectedCourses(selectedCourses.filter(c => c.courseId !== courseId));
  };

  const handleSubmit = async (values: CareerFormValues) => {
    try {
      // Preparamos el payload para crear la carrera SIN cursos (los agregaremos después)
      const payload = {
        ...values,
        characteristics: selectedCharacteristics.map(id => {
          const characteristic = characteristics.find(c => c.characteristicsId === id);
          return characteristic
            ? {
              characteristicsId: characteristic.characteristicsId,
              characteristicsName: characteristic.characteristicsName,
              characteristicsDescription: (characteristic as any).characteristicsDescription || ''
            }
            : { characteristicsId: id, characteristicsName: '', characteristicsDescription: '' };
        }),
        // IMPORTANTE: No mandamos cursos en este payload porque los agregaremos luego uno a uno
        curricula: {} // Lo dejamos vacío o como el backend espera
      };

      // Paso 1: Crear la carrera y recibir el curriculaId
      const curriculaId = await addCareer(payload);

      // Paso 2: Agregar cursos a la malla uno por uno
      for (const course of selectedCourses) {
        await addCourseToCareer(curriculaId, course.courseId, course.semester);
      }

      // Confirmación al usuario
      Swal.fire({
        title: 'Éxito',
        text: 'La carrera y sus cursos se han creado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });

      // Navegar a la lista de carreras
      navigate('/career-list');
    } catch (error) {
      console.error('Error saving career:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al crear la carrera. Inténtalo de nuevo.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  const handleCancel = () => {
    navigate('/career-list');
  };

  const formFields: FormField[] = [
    {
      name: 'careerName',
      label: 'Nombre de la carrera',
      type: 'text',
      required: true,
      placeholder: 'Ingrese el nombre de la carrera'
    },
    {
      name: 'careerDescription',
      label: 'Descripción',
      type: 'textarea',
      required: true,
      placeholder: 'Describa los objetivos de la carrera'
    },
    {
      name: 'careerDurationYears',
      label: 'Duración (años)',
      type: 'number',
      required: true,
      min: 1,
      max: 10,
      placeholder: 'Ingrese la duración en años'
    }
  ];

  return (
    <div className="container py-4">
      <h2 className="mb-4">Nueva Carrera</h2>
      <GenericForm
        title=""
        icon="book"
        initialValues={{
          careerId: '',
          careerName: '',
          careerDescription: '',
          careerDurationYears: 5,
          characteristics: [],
          courses: []
        }}
        fields={formFields}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitText="Crear Carrera"
        renderExtraFields={() => (
          <>
            {/* Características */}
            <Form.Group className="mb-3">
              <Form.Label>Características</Form.Label>
              <Form.Select
                multiple
                value={selectedCharacteristics}
                onChange={e => {
                  const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
                  setSelectedCharacteristics(options);
                }}
              >
                {Array.isArray(characteristics) && characteristics.map(c => (
                  <option key={c.characteristicsId} value={c.characteristicsId}>
                    {c.characteristicsName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Cursos */}
            <Form.Group className="mb-3">
              <Form.Label>Agregar curso a la malla</Form.Label>
              <Row>
                <Col md={6}>
                  <Form.Select
                    value={selectedCourseId}
                    onChange={e => setSelectedCourseId(e.target.value)}
                  >
                    <option value="">Seleccione un curso</option>
                    {courses.map(course => (
                      <option key={course.courseId} value={course.courseId}>
                        {course.courseCode} - {course.courseName}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={selectedSemester}
                    onChange={e => setSelectedSemester(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Button
                    variant="primary"
                    onClick={handleAddCourse}
                    disabled={!selectedCourseId}
                  >
                    Agregar
                  </Button>
                </Col>
              </Row>
            </Form.Group>

            {/* Lista de cursos agregados */}
            {selectedCourses.length > 0 && (
              <div className="mb-3">
                <strong>Cursos agregados:</strong>
                <ul className="list-unstyled">
                  {selectedCourses.map(c => {
                    const course = courses.find(cs => cs.courseId === c.courseId);
                    return (
                      <li key={c.courseId} className="mb-2">
                        {course ? `${course.courseCode} - ${course.courseName}` : c.courseId} | Semestre: {c.semester}
                        <Button
                          variant="danger"
                          size="sm"
                          className="ms-2"
                          onClick={() => handleRemoveCourse(c.courseId)}
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