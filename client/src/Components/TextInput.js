import React from 'react';

function TextInput({
  label = '',
  type = 'text',
  placeholder = '',
  required = false,
  value = '',
  onChange = () => {},
  className = '',
  id,
  name,
}) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`input-group ${className}`}>
      {label && <label htmlFor={inputId}>{label}</label>}
      <input
        type={type}
        id={inputId}
        name={name || inputId}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value, e)}
      />
    </div>
  );
}

export default TextInput;