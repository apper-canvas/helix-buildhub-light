import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const ExpenseListItem = ({ expense }) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-surface rounded-lg flex items-center justify-center">
          <ApperIcon name="Receipt" className="w-4 h-4 text-warning" />
        </div>
        <div>
          <Text as="h3" className="font-medium text-gray-900 text-sm">{expense.description}</Text>
          <Text as="p" className="text-xs text-gray-500">{expense.category}</Text>
        </div>
      </div>
      <Text as="span" className="text-sm font-medium text-gray-900">${expense.amount.toLocaleString()}</Text>
    </div>
  );
};

export default ExpenseListItem;