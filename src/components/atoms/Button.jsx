import { motion } from 'framer-motion';

const Button = ({
  children,
  onClick,
  className = '',
  type = 'button',
  variant = 'primary', // primary, secondary, danger, ghost
  size = 'md', // sm, md, lg
  icon: Icon = null, // ApperIcon name string
  iconPosition = 'left', // left, right
  disabled = false,
  ...props
}) => {
  let baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size classes
  if (size === 'sm') baseClasses += ' px-3 py-1.5 text-sm';
  else if (size === 'lg') baseClasses += ' px-6 py-3 text-lg';
  else baseClasses += ' px-4 py-2 text-base'; // md

  // Variant classes
  if (variant === 'primary') baseClasses += ' bg-primary text-white shadow-sm hover:bg-primary/90 focus:ring-primary';
  else if (variant === 'secondary') baseClasses += ' bg-gray-100 text-gray-700 shadow-sm hover:bg-gray-200 focus:ring-gray-300';
  else if (variant === 'danger') baseClasses += ' bg-red-600 text-white shadow-sm hover:bg-red-700 focus:ring-red-500';
  else if (variant === 'ghost') baseClasses += ' text-gray-700 hover:bg-gray-100 focus:ring-gray-300';
  else if (variant === 'success') baseClasses += ' bg-success text-white shadow-sm hover:bg-success/90 focus:ring-success';

  if (disabled) {
    baseClasses += ' opacity-50 cursor-not-allowed';
  }

  const iconClasses = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const iconMarginClasses = iconPosition === 'left' ? 'mr-2' : 'ml-2';

  // Filter out non-DOM props before passing to motion.button
  const { whileHover, whileTap, ...restProps } = props;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${className}`}
      disabled={disabled}
      whileHover={whileHover}
      whileTap={whileTap}
      {...restProps}
    >
      {Icon && iconPosition === 'left' && <Icon name={Icon} className={`${iconClasses} ${iconMarginClasses}`} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon name={Icon} className={`${iconClasses} ${iconMarginClasses}`} />}
    </motion.button>
  );
};

export default Button;