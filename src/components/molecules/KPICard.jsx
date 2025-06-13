import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const KPICard = ({
  title,
  value,
  subtitle,
  total,
  icon,
  color,
  change,
  onClick,
  className = ''
}) => {
  return (
    <motion.div
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      onClick={onClick}
      className={`bg-white rounded-lg p-6 shadow-sm border border-gray-100 transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-md' : ''} ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <ApperIcon name={icon} className="w-6 h-6 text-white" />
        </div>
        {change && (
          <Text className="text-sm font-medium text-success">{change}</Text>
        )}
        {onClick && !change && (
          <ApperIcon name="ArrowUpRight" className="w-4 h-4 text-gray-400" />
        )}
      </div>
      <Text as="h3" className="text-sm font-medium text-gray-600 mb-1">
        {title}
      </Text>
      <div className="flex items-baseline space-x-2">
        <Text as="span" className="text-2xl font-bold text-gray-900">{value}</Text>
        {total && (
          <Text as="span" className="text-sm text-gray-500">/ {total}</Text>
        )}
        {subtitle && (
          <Text as="span" className="text-sm text-gray-500">{subtitle}</Text>
        )}
      </div>
    </motion.div>
  );
};

export default KPICard;