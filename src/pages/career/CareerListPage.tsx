// src/pages/CareerListPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableColumn } from '../../components/organisms/Tables/Table';
import { Button } from '../../components/atoms/Button/Button';
import { Icon } from '../../components/atoms/Icon/Icon';
import { getCareers, deleteCareer } from '../../services/careerService';
import Swal from "sweetalert2";



interface Career {
  career_id: string;
  career_name: string;
  career_description: string;
  career_duration_years: number;
  characteristics: Array<{
    characteristics_id: string;
    characteristics_name: string;
    characteristics_description: string;
  }>;
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
      (data as Career[]).sort((a: Career, b: Career) => a.career_name.localeCompare(b.career_name));
      setCareers(data as Career[]);
    } catch (error) {
      console.error('Error fetching careers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (career: Career) => {
    navigate(`/careers/edit/${career.career_id}`);
  };

  const handleDeleteClick = async (career: Career) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Esta acción eliminará la carrera "${career.career_name}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      handleConfirmDeleteWithId(career.career_id, career.career_name);
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
      key: 'career_name',
      label: 'Nombre',
      className: 'w-25'
    },
    {
      key: 'career_description',
      label: 'Descripción',
      className: 'w-40'
    },
    {
      key: 'career_duration_years',
      label: 'Duración (años)',
      className: 'text-center w-10',
      render: (row) => `${row.career_duration_years}`
    },
    {
      key: 'characteristics',
      label: 'Características',
      render: (row) => (
        <div className="d-flex flex-wrap gap-1">
          {row.characteristics?.map(char => (
            <span key={char.characteristics_id} className="badge bg-primary">
              {char.characteristics_name}
            </span>
          ))}
        </div>
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