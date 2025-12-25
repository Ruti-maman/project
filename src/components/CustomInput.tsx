import React from 'react';

interface InputProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
}

export const CustomInput = ({ label, type, placeholder, value, onChange }: InputProps) => {
  return (
    <div style={{ marginBottom: '15px', textAlign: 'right' }}>
      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        style={{
          width: '100%',
          padding: '10px',
          boxSizing: 'border-box',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      />
    </div>
  );
};
