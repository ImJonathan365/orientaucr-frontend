// src/pages/CareerListPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableColumn } from '../components/organisms/Tables/Table'; // Asegúrate de que esta ruta sea correcta
import { Button } from '../components/atoms/Button/Button';
import { Icon } from '../components/atoms/Icon/Icon';
import { getCareers, deleteCareer } from '../services/CareerService'; // Servicio API ficticio

interface Career {
  career_id: string;
  career_name: string;
  career_description: string;
  career_duration_years: number;
  characteristicList: Array<{
    characteristics_id: string;
    characteristics_name: string;
    characteristics_description: string;
  }>;
}

export const CareerListPage = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      setLoading(true);
      const data = await getCareers(); // Llamada a tu API
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

  const handleDelete = async (career: Career) => {
    if (window.confirm(`¿Estás seguro de eliminar ${career.career_name}?`)) {
      try {
        await deleteCareer(career.career_id);
        fetchCareers(); // Refrescar la lista
      } catch (error) {
        console.error('Error deleting career:', error);
      }
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
      key: 'characteristicList',
      label: 'Características',
      render: (row) => (
        <div className="d-flex flex-wrap gap-1">
          {row.characteristicList?.map(char => (
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
        <Button 
          variant="primary" 
          onClick={() => navigate('/careers/new')}
        >
          <Icon variant="add" className="me-2" />
          Nueva Carrera
        </Button>
      </div>
      
      <Table
        columns={columns}
        data={careers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};