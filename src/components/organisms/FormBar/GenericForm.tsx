import React from 'react';
import { Button } from '../../atoms/Button/Button';
import { Icon } from '../../atoms/Icon/Icon';
import { Text } from '../../atoms/Text/Text';
import { IconVariant } from '../../atoms/Icon/Icon';

export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'number' | 'textarea' | 'select' | 'date' | 'file';
    required?: boolean;
    options?: Array<{ value: string | number; label: string }>;
    placeholder?: string;
    min?: number;
    max?: number;
    disabled?: boolean;
    accept?: string;
}

interface GenericFormProps<T = any> {
    title: string;
    initialValues: T;
    fields: FormField[];
    onSubmit: (values: T) => void;
    onCancel?: () => void;
    submitText?: string;
    cancelText?: string;
    icon?: IconVariant;
}

export const GenericForm = <T extends Record<string, any>>({
    title,
    initialValues,
    fields,
    onSubmit,
    onCancel,
    submitText = 'Guardar',
    cancelText = 'Cancelar',
    icon
}: GenericFormProps<T>) => {
    const [formValues, setFormValues] = React.useState<T>(initialValues);
    const [filePreviews, setFilePreviews] = React.useState<Record<string, string>>({});

    // Sincroniza formValues cuando initialValues cambia
    React.useEffect(() => {
        setFormValues(initialValues);
    }, [initialValues]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // Manejo especial para inputs de tipo file
        if (type === 'file') {
            const fileInput = e.target as HTMLInputElement;
            const file = fileInput.files?.[0];

            if (file) {
                // Validar tipo de archivo
                const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
                if (!validTypes.includes(file.type)) {
                    alert('Por favor, sube solo imágenes en formato JPG o PNG');
                    return;
                }

                // Crear vista previa
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreviews(prev => ({
                        ...prev,
                        [name]: reader.result as string
                    }));
                };
                reader.readAsDataURL(file);

                // Actualizar el valor del campo (aunque para files normalmente manejamos el file object aparte)
                setFormValues(prev => ({
                    ...prev,
                    [name]: file.name // O podrías almacenar el file object si lo necesitas
                }));
            }
        } else {
            // Manejo para todos los otros tipos de inputs
            setFormValues(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formValues);
    };

    return (
        <div className="card shadow-sm">
            <div className="card-header bg-white">
                <div className="d-flex align-items-center">
                    {icon && <Icon variant={icon} size="lg" className="me-3" />}
                    <Text variant="title" as="h3">{title}</Text>
                </div>
            </div>

            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    {fields.map((field) => (
                        <div key={field.name} className="mb-3">
                            <label htmlFor={field.name} className="form-label">
                                {field.label} {field.required && <span className="text-danger">*</span>}
                            </label>

                            {field.type === 'textarea' ? (
                                <textarea
                                    id={field.name}
                                    name={field.name}
                                    className="form-control"
                                    value={formValues[field.name] || ''}
                                    onChange={handleChange}
                                    required={field.required}
                                    placeholder={field.placeholder}
                                    rows={4}
                                    disabled={field.disabled}
                                />
                            ) : field.type === 'select' ? (
                                <select
                                    id={field.name}
                                    name={field.name}
                                    className="form-select"
                                    value={formValues[field.name] || ''}
                                    onChange={handleChange}
                                    required={field.required}
                                    disabled={field.disabled}
                                >
                                    <option value="">Seleccione...</option>
                                    {field.options?.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : field.type === 'file' ? (
                                <>
                                    <input
                                        type="file"
                                        id={field.name}
                                        name={field.name}
                                        className="form-control"
                                        onChange={handleChange}
                                        required={field.required}
                                        accept={field.accept || 'image/*'}
                                        disabled={field.disabled}
                                    />
                                    {filePreviews[field.name] && (
                                        <div className="mt-2">
                                            <img
                                                src={filePreviews[field.name]}
                                                alt="Vista previa"
                                                style={{ maxWidth: '100px', maxHeight: '100px' }}
                                                className="img-thumbnail"
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <input
                                    type={field.type}
                                    id={field.name}
                                    name={field.name}
                                    className="form-control"
                                    value={formValues[field.name] || ''}
                                    onChange={handleChange}
                                    required={field.required}
                                    placeholder={field.placeholder}
                                    min={field.min}
                                    max={field.max}
                                    disabled={field.disabled}
                                />
                            )}
                        </div>
                    ))}

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        {onCancel && (
                            <Button variant="secondary" type="button" onClick={onCancel}>
                                <Icon variant="close" className="me-2" />
                                {cancelText}
                            </Button>
                        )}

                        <Button variant="primary" type="submit">
                            <Icon variant="check" className="me-2" />
                            {submitText}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};