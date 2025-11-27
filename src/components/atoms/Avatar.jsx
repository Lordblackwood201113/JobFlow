import { User } from 'lucide-react';

const Avatar = ({ src, alt = 'Avatar', size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
    '2xl': 'h-32 w-32',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
    '2xl': 'h-16 w-16',
  };

  if (!src) {
    return (
      <div
        className={`${sizes[size]} rounded-full bg-gray-200 flex items-center justify-center ${className}`}
      >
        <User className={`${iconSizes[size]} text-gray-500`} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${sizes[size]} rounded-full object-cover ${className}`}
    />
  );
};

export default Avatar;
