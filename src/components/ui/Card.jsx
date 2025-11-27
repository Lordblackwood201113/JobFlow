const Card = ({ children, className = '', padding = true, ...props }) => {
  const baseStyles = 'bg-white rounded-[24px] shadow-sm';
  const paddingStyles = padding ? 'p-6' : '';

  return (
    <div className={`${baseStyles} ${paddingStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
