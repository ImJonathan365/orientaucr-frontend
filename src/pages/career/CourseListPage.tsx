import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Table, TableColumn } from '../../components/organisms/Tables/Table';
import { Button } from '../../components/atoms/Button/Button';
import { Icon } from '../../components/atoms/Icon/Icon';
import { getCareerById } from '../../services/careerService';
import { Career, Course } from '../../types/careerTypes';
import { Alert, Spinner } from 'react-bootstrap';
import Swal from "sweetalert2";

export const CourseListPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [career, setCareer] = useState<Career | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err: any) {
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
        <Button
          variant="secondary"
          onClick={() => navigate('/career-list')}
        >
          <Icon variant="arrow-left" className="me-2" />
          Regresar
        </Button>
      </div>
      <Table
        columns={columns}
        data={career.curricula.courses}
      />
    </div>
  );
};