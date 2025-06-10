import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GenericForm } from '../../components/organisms/FormBar/GenericForm';
import { addCareer } from '../../services/careerService';
import { FormField } from '../../components/organisms/FormBar/GenericForm';
import Swal from "sweetalert2";

interface CareerFormValues {
  careerId?: string;
  careerName: string;
  careerDescription: string;
  careerDurationYears: number;
}

export const NewCareerPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: CareerFormValues) => {
    try {
      await addCareer(values);
      Swal.fire({
        title: 'Éxito',
        text: 'La carrera se ha creado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      navigate('/career-list'); 
    } catch (error) {
      console.error('Error saving career:', error);
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
      <GenericForm
        title="Nueva Carrera"
        icon="book"
        initialValues={{
          careerId: '',
          careerName: '',
          careerDescription: '',
          careerDurationYears: 5
        }}
        fields={formFields}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitText="Crear Carrera"
      />
    </div>
  );
};