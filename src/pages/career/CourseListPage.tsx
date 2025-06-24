import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Table, TableColumn } from '../../components/organisms/Tables/Table';
import { Button } from '../../components/atoms/Button/Button';
import { Icon } from '../../components/atoms/Icon/Icon';
import { getCareerById, deleteCourseFromCareer, getCoursesForCurricula, addCourseToCareer } from '../../services/careerService';
import { Career, Course } from '../../types/carrerTypes';
import { Alert, Spinner, Form, Row, Col } from 'react-bootstrap';
import Swal from "sweetalert2";
import { updateCourse, getNumberCarrersAssociated } from '../../services/courseService';

export const CourseListPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [career, setCareer] = useState<Career | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Para agregar curso
  const [showAdd, setShowAdd] = useState(false);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [adding, setAdding] = useState(false);

  // Cargar carrera
  useEffect(() => {
    const fetchCareer = async () => {
      if (!id) {
        setIsLoading(false);
        Swal.fire({
          title: 'Error',
          text: 'No se proporcionó ID de carrera',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          navigate('/career-list');
        });
        return;
      }
      try {
        setIsLoading(true);
        const data = await getCareerById(id);
        if (!data || !data.careerId) {
          Swal.fire({
            title: 'No encontrado',
            text: 'No se pudo encontrar la carrera solicitada.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            navigate('/career-list');
          });
          return;
        }
        setCareer(data);
      } catch (err: unknown) {
        setError('No se pudo encontrar la carrera solicitada.');
        Swal.fire({
          title: 'Error',
          text: 'No se pudo encontrar la carrera solicitada.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          navigate('/career-list');
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCareer();
  }, [id, navigate]);

  // Cargar cursos disponibles para agregar
  const fetchAvailableCourses = async () => {
    if (career?.curricula?.curriculaId) {
      const courses = await getCoursesForCurricula(career.curricula.curriculaId);
      setAvailableCourses(courses as Course[]);
      setSelectedCourseId('');
      setSelectedSemester(1);
    }
  };

  // Mostrar formulario al hacer clic en agregar
  const handleShowAdd = async () => {
    setShowAdd(!showAdd);
    if (!showAdd && career?.curricula?.curriculaId) {
      await fetchAvailableCourses();
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedCourseId || !career?.curricula?.curriculaId) return;
  setAdding(true);
  try {
    // Llama al servicio centralizado
    await addCourseToCareer(
      career.curricula.curriculaId,
      selectedCourseId,
      selectedSemester
    );
    
    const addedCourse = availableCourses.find(c => c.courseId === selectedCourseId);
    if (addedCourse) {
      await updateCourse({
        ...addedCourse,
        courseIsAsigned: true
      });
    }

    await Swal.fire("Agregado", "El curso fue agregado correctamente.", "success");
    // Refrescar carrera y cursos disponibles
    const updatedCareer = await getCareerById(career.careerId);
    setCareer(updatedCareer);
    await fetchAvailableCourses();
    setSelectedCourseId('');
    setSelectedSemester(1);
  } catch (error) {
    await Swal.fire("Error", "Hubo un problema al agregar el curso.", "error");
  } finally {
    setAdding(false);
  }
};

  // Eliminar curso
  const handleDeleteCourse = async (course: Course) => {
    if (!career) return;
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Esta acción eliminará el curso "${course.courseName}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        if (!career.curricula) {
          await Swal.fire("Error", "No se encontró la malla curricular para esta carrera.", "error");
          return;
        }
        await deleteCourseFromCareer(career.curricula.curriculaId, course.courseId);

        const numberOfCareersAssociated = await getNumberCarrersAssociated(course.courseId);
        if (!course.courseIsShared || numberOfCareersAssociated === 0) {
          await updateCourse({
            ...course,
            courseIsAsigned: false
          });
        };

        await Swal.fire("Eliminado", `El curso "${course.courseName}" fue eliminado correctamente.`, "success");
        const updatedCareer = await getCareerById(career.careerId);
        setCareer(updatedCareer);
        // Refrescar cursos disponibles
        await fetchAvailableCourses();
      } catch (error) {
        await Swal.fire("Error", "Hubo un problema al eliminar el curso.", "error");
      }
    }
  };

  const columns: TableColumn<Course>[] = [
    {
      key: 'courseCode',
      label: 'Código',
      className: 'w-15'
    },
    {
      key: 'courseName',
      label: 'Nombre',
      className: 'w-30'
    },
    {
      key: 'courseDescription',
      label: 'Descripción',
      className: 'w-40'
    },
    {
      key: 'courseCredits',
      label: 'Créditos',
      className: 'text-center w-10',
      render: (row) => `${row.courseCredits}`
    },
    {
      key: 'courseSemester',
      label: 'Semestre',
      className: 'text-center w-10',
      render: (row) => `${row.courseSemester}`
    }
  ];

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Cargando malla curricular...</span>
      </div>
    );
  }

  if (error || !career || !career.curricula || !career.curricula.courses) {
    return (
      <div className="container mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error || 'No se encontró la malla curricular para esta carrera.'}</p>
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Malla Curricular de {career.careerName}</h2>
        <div className="d-flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate('/career-list')}
          >
            <Icon variant="arrow-left" className="me-2" />
            Regresar
          </Button>
          <Button
            variant="primary"
            onClick={handleShowAdd}
          >
            Agregar curso
            <Icon
              variant={showAdd ? "chevron-down" : "chevron-right"}
              className="ms-2"
            />
          </Button>
        </div>
      </div>

      {showAdd && (
        <Form onSubmit={handleAddCourse} className="mb-4 border rounded p-3 bg-light">
          <Row className="align-items-end">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Curso</Form.Label>
                <Form.Select
                  value={selectedCourseId}
                  onChange={e => setSelectedCourseId(e.target.value)}
                  required
                >
                  <option value="">Seleccione un curso</option>
                  {availableCourses.map(course => (
                    <option key={course.courseId} value={course.courseId}>
                      {course.courseCode} - {course.courseName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Semestre</Form.Label>
                <Form.Select
                  value={selectedSemester}
                  onChange={e => setSelectedSemester(Number(e.target.value))}
                  required
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex gap-2">
              <Button
                type="submit"
                variant="primary"
                disabled={adding || !selectedCourseId}
              >
                {adding ? "Agregando..." : "Agregar"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowAdd(false)}
              >
                Cancelar
              </Button>
            </Col>
          </Row>
        </Form>
      )}

      <Table
        columns={columns}
        data={career.curricula.courses}
        onDelete={handleDeleteCourse}
      />
    </div>
  );
};
