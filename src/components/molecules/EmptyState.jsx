import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const EmptyState = ({
  icon,
  title,
  description,
  buttonText,
  onButtonClick
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-12 bg-white rounded-lg shadow-sm"
    >
      <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name={icon} className="w-8 h-8 text-primary" />
      </div>
      <Text as="h3" className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </Text>
      <Text className="text-gray-500 mb-4">
        {description}
      </Text>
      {buttonText && onButtonClick && (
        <Button onClick={onButtonClick} variant="primary">
          {buttonText}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;