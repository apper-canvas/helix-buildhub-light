import { motion } from 'framer-motion';

const Card = ({ children, className = '', whileHover, onClick, ...props }) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-100';
  
  if (whileHover || onClick) {
    return (
      <motion.div
        className={`${baseClasses} hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer' : ''} ${className}`}
        whileHover={whileHover}
        onClick={onClick}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;