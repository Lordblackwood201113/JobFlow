import { forwardRef } from 'react';

const Select = forwardRef(
  (
    {
      label,
      options = [],
      error,
      helperText,
      className = '',
      containerClassName = '',
      disabled = false,
      required = false,
      placeholder = 'Sélectionner...',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'w-full px-4 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-gray-100 disabled:cursor-not-allowed bg-white';

    const selectStyles = error
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-[#D8F26E] focus:border-[#D8F26E]';

    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          disabled={disabled}
          className={`${baseStyles} ${selectStyles} ${className}`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className="text-sm text-red-500">{error}</span>}
        {helperText && !error && (
          <span className="text-sm text-gray-500">{helperText}</span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
