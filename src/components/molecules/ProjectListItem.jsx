import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Badge from '@/components/atoms/Badge';

const ProjectListItem = ({ project }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Planning': return 'warning';
      case 'Completed': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-surface rounded-lg flex items-center justify-center">
          <ApperIcon name="Building2" className="w-4 h-4 text-primary" />
        </div>
        <div>
          <Text as="h3" className="font-medium text-gray-900 text-sm">{project.name}</Text>
          <Text as="p" className="text-xs text-gray-500">Due: {new Date(project.deadline).toLocaleDateString()}</Text>
        </div>
      </div>
      <Badge variant={getStatusVariant(project.status)}>
        {project.status}
      </Badge>
    </div>
  );
};

export default ProjectListItem;