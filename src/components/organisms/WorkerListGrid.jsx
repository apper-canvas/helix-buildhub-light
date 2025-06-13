import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Badge from '@/components/atoms/Badge';

const WorkerListGrid = ({ workers, projects, onEdit, onDelete }) => {
  const getProjectNames = (projectIds) => {
    return projectIds.map(id => {
      const project = projects.find(p => p.id === id);
      return project ? project.name : 'Unknown';
    }).join(', ');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {workers.map((worker, index) => (
        <motion.div
          key={worker.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="HardHat" className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <Text as="h3" className="font-semibold text-gray-900 break-words">{worker.name}</Text>
                  <Text as="p" className="text-sm text-gray-500">{worker.role}</Text>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => onEdit(worker)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ApperIcon name="Edit" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(worker.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Phone" className="w-4 h-4 text-gray-400" />
                <Text as="span" className="text-sm text-gray-600">{worker.phone}</Text>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Mail" className="w-4 h-4 text-gray-400" />
                <Text as="span" className="text-sm text-gray-600 break-words">{worker.email}</Text>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="DollarSign" className="w-4 h-4 text-gray-400" />
                <Text as="span" className="text-sm text-gray-600">${worker.dailyRate}/day</Text>
              </div>

              {worker.projectIds?.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <ApperIcon name="Building2" className="w-4 h-4 text-gray-400" />
                    <Text as="span" className="text-sm font-medium text-gray-700">Assigned Projects</Text>
                  </div>
                  <Text as="p" className="text-sm text-gray-600 break-words">{getProjectNames(worker.projectIds)}</Text>
                </div>
              )}

              {worker.skills?.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <ApperIcon name="Wrench" className="w-4 h-4 text-gray-400" />
                    <Text as="span" className="text-sm font-medium text-gray-700">Skills</Text>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {worker.skills.map(skill => (
                      <Badge key={skill} variant="default">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-gray-100">
                <Badge variant={(worker.projectIds || []).length === 0 ? 'success' : 'warning'}>
                  {(worker.projectIds || []).length === 0 ? 'Available' : 'Assigned'}
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default WorkerListGrid;