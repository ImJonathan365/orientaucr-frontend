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

    // Sincroniza formValues cuando initialValues cambia
    React.useEffect(() => {
        setFormValues(initialValues);
    }, [initialValues]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
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