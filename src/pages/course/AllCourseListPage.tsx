// src/pages/AllCourseListPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableColumn } from '../../components/organisms/Tables/Table';
import { Button } from '../../components/atoms/Button/Button';
import { Icon } from '../../components/atoms/Icon/Icon';
import { getCourses, deleteCourse, getCourseById } from '../../services/courseService';
import Swal from "sweetalert2";

interface Course {
  courseId: string;
  courseCode: string;
  courseCredits: number;
  courseIsShared: boolean;
  courseIsAsigned: boolean;
  courseName: string;
  courseDescription: string;
  courseSemester: number;
  prerequisites: string[];
  corequisites: string[];
}

export const AllCourseListPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const PrerequisitesList = ({ prereqIds }: { prereqIds: string[] }) => {
    const [prereqs, setPrereqs] = useState<Course[]>([]);

    useEffect(() => {
      const fetchPrereqs = async () => {
        try {
          const promises = prereqIds.map(id => getCourseById(id));
          const results = await Promise.all(promises);
          setPrereqs(results);
        } catch (error) {
          console.error("Error fetching prerequisites", error);
        }
      };

      if (prereqIds.length > 0) {
        fetchPrereqs();
      } else {
        setPrereqs([]);
      }
    }, [prereqIds]);

    return (
      <div className="d-flex flex-wrap gap-1">
        {prereqs.map(p => (
          <span key={p.courseId} className="badge bg-primary">
            {p.courseCode}
          </span>
        ))}
      </div>
    );
  };

  const CorequisitesList = ({ prereqIds }: { prereqIds: string[] }) => {
    const [coreqs, setCoreqs] = useState<Course[]>([]);

    useEffect(() => {
      const fetchCoreqs = async () => {
        try {
          const promises = prereqIds.map(id => getCourseById(id));
          const results = await Promise.all(promises);
          setCoreqs(results);
        } catch (error) {
          console.error("Error fetching corequisites", error);
        }
      };

      if (prereqIds.length > 0) {
        fetchCoreqs();
      } else {
        setCoreqs([]);
      }
    }, [prereqIds]);

    return (
      <div className="d-flex flex-wrap gap-1">
        {coreqs.map(c => (
          <span key={c.courseId} className="badge bg-secondary">
            {c.courseCode}
          </span>
        ))}
      </div>
    );
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data: Course[] = await getCourses();
      const sorted = data.sort((a, b) => a.courseCode.localeCompare(b.courseCode));
      setCourses(sorted);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course: Course) => {
    navigate(`/courses/edit/${course.courseId}`);
  };

  const handleDeleteClick = async (course: Course) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Esta acción eliminará el curso "${course.courseName}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      handleConfirmDeleteWithId(course.courseId, course.courseName);
    }
  };

  const handleConfirmDeleteWithId = async (courseId: string, courseName: string) => {
    try {
      await deleteCourse(courseId);
      await Swal.fire("Eliminado", `El curso "${courseName}" fue eliminado correctamente.`, "success");
      fetchCourses();
    } catch (error) {
      await Swal.fire("Error", "Hubo un problema al eliminar el curso.", "error");
      console.error('Error deleting course:', error);
    }
  };

  const columns: TableColumn<Course>[] = [
    {
      key: 'courseCode',
      label: 'Código',
      className: 'w-25',
    },
    {
      key: 'courseName',
      label: 'Nombre',
      className: 'w-25',
    },
    {
      key: 'courseDescription',
      label: 'Descripción',
      className: 'w-50',
    },
    {
      key: 'courseCredits',
      label: 'Créditos',
      className: 'text-center w-10',
      render: (row) => (
        <div className="text-center">{row.courseCredits}</div>
      )
    },
    {
      key: 'courseIsShared',
      label: 'Compartido',
      className: 'text-center w-10',
      render: (row) => (
        <div className="text-center">
          {row.courseIsShared
            ? <Icon variant="check" className="text-success" />
            : <Icon variant="close" className="text-danger" />}
        </div>
      )
    },
    {
      key: 'prerequisites',
      label: 'Prerrequisitos',
      render: (row) => <PrerequisitesList prereqIds={row.prerequisites} />,
      className: 'w-20',
    },
    {
      key: 'corequisites',
      label: 'Correquisitos',
      render: (row) => <CorequisitesList prereqIds={row.corequisites} />,
      className: 'w-20',
    }
  ];

  if (loading) {
    return <div>Cargando cursos...</div>;
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Listado de Cursos</h2>
        <div className="d-flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate('/home')}
          >
            <Icon variant="home" className="me-2" />
            Regresar
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/courses/new')}
          >
            <Icon variant="add" className="me-2" />
            Nuevo Curso
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        data={courses}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />
    </div>
  );
};