import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const ActivityItem = ({ icon, action, time }) => {
  return (
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 bg-surface rounded-full flex items-center justify-center flex-shrink-0">
        <ApperIcon name={icon} className="w-4 h-4 text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <Text as="p" className="text-sm text-gray-900 break-words">{action}</Text>
        <Text as="p" className="text-xs text-gray-500 mt-1">{time}</Text>
      </div>
    </div>
  );
};

export default ActivityItem;