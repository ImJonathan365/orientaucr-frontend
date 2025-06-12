import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenericForm } from '../../components/organisms/FormBar/GenericForm';
import { addCareer, getCoursesForCurricula, addCourseToCareer, getCareers } from '../../services/careerService';
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

  function normalizeString(str: string) {
    return str
      .normalize('NFD')               // Descompone letras con tilde en letra + tilde
      .replace(/[\u0300-\u036f]/g, '') // Elimina los caracteres de tilde
      .replace(/\s+/g, ' ')            // Reemplaza múltiples espacios por uno solo
      .trim()                         // Elimina espacios al inicio y fin
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')     // Elimina caracteres no alfanuméricos;
      .replace(/\s+/g, '')
      .replace(/[^a-zA-Z0-9 ]/g, '')
  }

  const handleSubmit = async (values: CareerFormValues) => {
    try {
      const existingCareers = await getCareers();
      const existingNames = existingCareers.map(c => normalizeString(c.careerName));
      const newCareerName = normalizeString(values.careerName);

      const hasSpecialChars = /[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]/.test(values.careerName);
      if (hasSpecialChars) {
        Swal.fire({
          title: 'Caracteres no permitidos',
          text: 'El nombre no debe contener caracteres especiales. Solo letras, números y espacios.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return;
      }
      if (existingNames.includes(newCareerName)) {
        Swal.fire({
          title: 'Nombre ya existe',
          text: 'Ya existe una carrera con ese nombre. Por favor, elige otro.',
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        });
        return;
      }
      const payload = {
        ...values,
        characteristics: values.characteristics.map(id => {
          const characteristic = characteristics.find(c => c.characteristicsId === id);
          return characteristic
            ? {
              characteristicsId: characteristic.characteristicsId,
              characteristicsName: characteristic.characteristicsName,
              characteristicsDescription: (characteristic as any).characteristicsDescription || ''
            }
            : { characteristicsId: id, characteristicsName: '', characteristicsDescription: '' };
        }),

        curricula: {}
      };

      const curriculaId = await addCareer(payload);

      for (const course of selectedCourses) {
        await addCourseToCareer(curriculaId, course.courseId, course.semester);
      }

      Swal.fire({
        title: 'Éxito',
        text: 'La carrera y sus cursos se han creado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });

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
    },
    {
      name: 'characteristics',
      label: 'Características',
      type: 'checkbox-group',
      required: true,
      options: characteristics
        .sort((a, b) => a.characteristicsName.localeCompare(b.characteristicsName))
        .map(c => ({
          value: c.characteristicsId,
          label: c.characteristicsName,
        }))
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
                    {courses
                      .filter(course => !selectedCourses.some(sc => sc.courseId === course.courseId))
                      .map(course => (
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