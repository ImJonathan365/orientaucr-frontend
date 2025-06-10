import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Table, TableColumn } from '../../components/organisms/Tables/Table';
import { Button } from '../../components/atoms/Button/Button';
import { Icon } from '../../components/atoms/Icon/Icon';
import { getCareerById } from '../../services/careerService';
import { Career, Course } from '../../types/careerTypes';

export const CourseListPage = () => {
  const { id } = useParams<{ id: string }>();
  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        if (id) {
          const data = await getCareerById(id);
          console.log('Career data:', data);
          setCareer(data);
        }
      } catch (error) {
        console.error('Error fetching career:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCareer();
  }, [id]);

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

  if (loading) {
    return <div>Cargando malla curricular...</div>;
  }

  if (!career || !career.curricula || !career.curricula.courses) {
    return <div>No se encontró la malla curricular para esta carrera.</div>;
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