const Tag = ({ status, size = 'md', className = '' }) => {
  const statusConfig = {
    'Brouillon': {
      bg: 'bg-gray-50',
      border: 'border-gray-400',
      text: 'text-gray-700',
    },
    'Envoyé': {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      text: 'text-blue-700',
    },
    'Entretien': {
      bg: 'bg-purple-50',
      border: 'border-purple-500',
      text: 'text-purple-700',
    },
    'Offre': {
      bg: 'bg-green-50',
      border: 'border-green-500',
      text: 'text-green-700',
    },
    'Refus': {
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-700',
    },
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const config = statusConfig[status] || statusConfig['Brouillon'];

  return (
    <span
      className={`inline-flex items-center rounded-[16px] border font-medium ${config.bg} ${config.border} ${config.text} ${sizes[size]} ${className}`}
    >
      {status}
    </span>
  );
};

export default Tag;
