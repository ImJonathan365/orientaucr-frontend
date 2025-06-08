import React from 'react';

interface Props {
  value: string;
  isCorrect: boolean;
  onChangeText: (text: string) => void;
  onChangeCorrect: (checked: boolean) => void;
  onRemove: () => void;
  name: string; // <-- nuevo prop
}

export const SimulationOptionInput: React.FC<Props> = ({
  value, isCorrect, onChangeText, onChangeCorrect, onRemove, name
}) => (
  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
    <input
      type="text"
      value={value}
      onChange={e => onChangeText(e.target.value)}
      placeholder="Texto de la opción"
      required
    />
    <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <input
        type="radio"
        checked={isCorrect}
        onChange={() => onChangeCorrect(true)}
        name={name} // <-- usa el prop name
      />
      Correcta
    </label>
    <button type="button" onClick={onRemove}>Eliminar</button>
  </div>
);