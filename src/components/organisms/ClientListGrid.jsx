import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Badge from '@/components/atoms/Badge';

const ClientListGrid = ({ clients, projects, onEdit, onDelete }) => {
  const getClientProjects = (clientId) => {
    return projects.filter(p => p.clientId === clientId);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Planning': return 'warning';
      case 'Completed': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {clients.map((client, index) => {
        const clientProjects = getClientProjects(client.id);
        return (
          <motion.div
            key={client.id}
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
                    <ApperIcon name="Building" className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <Text as="h3" className="font-semibold text-gray-900 break-words">{client.companyName}</Text>
                    <Text as="p" className="text-sm text-gray-500">{client.contactPerson}</Text>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => onEdit(client)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ApperIcon name="Edit" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(client.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Mail" className="w-4 h-4 text-gray-400" />
                  <Text as="span" className="text-sm text-gray-600 break-words">{client.email}</Text>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Phone" className="w-4 h-4 text-gray-400" />
                  <Text as="span" className="text-sm text-gray-600">{client.phone}</Text>
                </div>
                <div className="flex items-start space-x-2">
                  <ApperIcon name="MapPin" className="w-4 h-4 text-gray-400 mt-0.5" />
                  <Text as="span" className="text-sm text-gray-600 break-words">{client.address}</Text>
                </div>
                
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <Text as="span" className="text-sm font-medium text-gray-700">Projects</Text>
                    <Text as="span" className="text-sm text-gray-500">{clientProjects.length}</Text>
                  </div>
                  {clientProjects.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {clientProjects.slice(0, 3).map(project => (
                        <div key={project.id} className="flex items-center justify-between text-xs">
                          <Text as="span" className="text-gray-600 break-words">{project.name}</Text>
                          <Badge variant={getStatusVariant(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                      ))}
                      {clientProjects.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{clientProjects.length - 3} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ClientListGrid;