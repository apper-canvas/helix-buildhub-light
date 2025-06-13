const Badge = ({ children, variant = 'default', className = '' }) => {
  let baseClasses = 'px-2 py-1 text-xs rounded-full font-medium';

  if (variant === 'primary') baseClasses += ' bg-primary/10 text-primary';
  else if (variant === 'success') baseClasses += ' bg-success/10 text-success';
  else if (variant === 'warning') baseClasses += ' bg-warning/10 text-warning';
  else if (variant === 'danger') baseClasses += ' bg-red-100 text-red-700';
  else if (variant === 'info') baseClasses += ' bg-info/10 text-info';
  else if (variant === 'accent') baseClasses += ' bg-accent/10 text-accent';
  else baseClasses += ' bg-gray-100 text-gray-600'; // default

  return (
    <span className={`${baseClasses} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;