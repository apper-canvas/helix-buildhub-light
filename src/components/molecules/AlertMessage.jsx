import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const AlertMessage = ({
  type = 'error', // success, warning, info
  title,
  message,
  onRetry
}) => {
  let bgColor, borderColor, textColor, iconColor;
  let IconComponent = 'AlertCircle'; // Default icon

  if (type === 'error') {
    bgColor = 'bg-red-50';
    borderColor = 'border-red-200';
    textColor = 'text-red-700';
    iconColor = 'text-red-500';
    IconComponent = 'AlertCircle';
  } else if (type === 'success') {
    bgColor = 'bg-green-50';
    borderColor = 'border-green-200';
    textColor = 'text-green-700';
    iconColor = 'text-green-500';
    IconComponent = 'CheckCircle';
  } else if (type === 'warning') {
    bgColor = 'bg-yellow-50';
    borderColor = 'border-yellow-200';
    textColor = 'text-yellow-700';
    iconColor = 'text-yellow-500';
    IconComponent = 'AlertTriangle';
  } else if (type === 'info') {
    bgColor = 'bg-blue-50';
    borderColor = 'border-blue-200';
    textColor = 'text-blue-700';
    iconColor = 'text-blue-500';
    IconComponent = 'Info';
  }

  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-6 text-center`}>
      <ApperIcon name={IconComponent} className={`w-12 h-12 ${iconColor} mx-auto mb-4`} />
      <Text as="h3" className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </Text>
      <Text className={`${textColor} mb-4`}>{message}</Text>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          Retry
        </Button>
      )}
    </div>
  );
};

export default AlertMessage;