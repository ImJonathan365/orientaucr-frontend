import React from "react";
import { Button } from "../../atoms/Button/Button";
import { Icon } from "../../atoms/Icon/Icon";
import { Text } from "../../atoms/Text/Text";

export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

export function Table<T = any>({
  columns,
  data,
  onEdit,
  onDelete,
}: TableProps<T>) {
  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>#</th>
            {columns.map((col) => (
              <th key={col.key as string} className={col.className}>
                <Text variant="title" as="span">{col.label}</Text>
              </th>
            ))}
            {(onEdit || onDelete) && <th></th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 2}>
                <Text color="muted">Sin datos para mostrar</Text>
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                {columns.map((col) => (
                  <td key={col.key as string}>
                    {col.render
                      ? col.render(row, idx)
                      : (row as any)[col.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td>
                    <div className="d-flex gap-2">
                      {onEdit && (
                        <Button variant="info" size="small" onClick={() => onEdit(row)}>
                          <Icon variant="edit" size="sm" className="me-1" />
                          Editar
                        </Button>
                      )}
                      {onDelete && (
                        <Button variant="danger" size="small" onClick={() => onDelete(row)}>
                          <Icon variant="trash" size="sm" className="me-1" />
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}