// src/pages/CareerListPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableColumn } from '../../components/organisms/Tables/Table';
import { Button } from '../../components/atoms/Button/Button';
import { Icon } from '../../components/atoms/Icon/Icon';
import { getCareers, deleteCareer } from '../../services/careerService';
import Swal from "sweetalert2";



interface Characteristic {
  characteristicsId: string;
  characteristicsName: string;
  characteristicsDescription: string;
}

interface Course {
  courseId: string;
  courseCode: string;
  courseCredits: number;
  courseName: string;
  courseDescription: string;
  courseSemester: number;
}

interface Curricula {
  curriculaId: string;
  courseList?: Course[];
}

interface Career {
  careerId: string;
  careerName: string;
  careerDescription: string;
  careerDurationYears: number;
  characteristics: Characteristic[];
}

export const CareerListPage = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [modalData, setModalData] = useState({
    show: false,
    careerId: null as string | null,
    careerName: "",
  });

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      setLoading(true);
      const data = await getCareers();
      (data as Career[]).sort((a: Career, b: Career) => a.careerName.localeCompare(b.careerName));
      setCareers(data as Career[]);
    } catch (error) {
      console.error('Error fetching careers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (career: Career) => {
    navigate(`/careers/edit/${career.careerId}`);
  };

  const handleDeleteClick = async (career: Career) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Esta acción eliminará la carrera "${career.careerName}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      handleConfirmDeleteWithId(career.careerId, career.careerName);
    }
  };

  const handleConfirmDeleteWithId = async (careerId: string, careerName: string) => {
    try {
      await deleteCareer(careerId);
      await Swal.fire("Eliminado", `La carrera "${careerName}" fue eliminada correctamente.`, "success");
      fetchCareers();
    } catch (error) {
      await Swal.fire("Error", "Hubo un problema al eliminar la carrera.", "error");
      console.error('Error deleting career:', error);
    }
  };


  const columns: TableColumn<Career>[] = [
    {
      key: 'careerName',
      label: 'Nombre',
      className: 'w-25'
    },
    {
      key: 'careerDescription',
      label: 'Descripción',
      className: 'w-40'
    },
    {
      key: 'careerDurationYears',
      label: 'Duración (años)',
      className: 'text-center w-10',
      render: (row) => (
        <div className="text-center">{row.careerDurationYears}</div>
      )
    },
    {
      key: 'characteristics',
      label: 'Características',
      render: (row) => (
        <div className="d-flex flex-wrap gap-1">
          {row.characteristics
            ?.slice()
            .sort((a, b) => a.characteristicsName.localeCompare(b.characteristicsName))
            .map(char => (
              <span key={char.characteristicsId} className="badge bg-primary">
                {char.characteristicsName}
              </span>
            ))}
        </div>
      )
    },
    {
      key: 'curricula',
      label: 'Malla Curricular',
      className: 'text-center w-10',
      render: (row) => (
        <Button
          variant="info"
          size="small"
          onClick={() => navigate(`/careers/curricula/${row.careerId}`)}
        >
          Ver Malla
        </Button>
      )
    }
  ];

  if (loading) {
    return <div>Cargando carreras...</div>;
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Listado de Carreras</h2>
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
            onClick={() => navigate('/careers/new')}
          >
            <Icon variant="add" className="me-2" />
            Nueva Carrera
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        data={careers}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />
    </div>
  );
};