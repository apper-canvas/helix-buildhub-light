const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  required = false,
  min,
  step,
  rows,
  multiple,
  children, // For select options
  ...props
}) => {
  const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent";

  if (type === 'textarea') {
    return (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${baseClasses} ${className}`}
        required={required}
        rows={rows}
        {...props}
      />
    );
  }

  if (type === 'select') {
    return (
      <select
        value={value}
        onChange={onChange}
        className={`${baseClasses} ${className}`}
        required={required}
        multiple={multiple}
        {...props}
      >
        {children}
      </select>
    );
  }

  if (type === 'checkbox') {
    return (
      <input
        type="checkbox"
        checked={value}
        onChange={onChange}
        className={`rounded border-gray-300 text-primary focus:ring-primary ${className}`}
        {...props}
      />
    );
  }

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${baseClasses} ${className}`}
      required={required}
      min={min}
      step={step}
      {...props}
    />
  );
};

export default Input;