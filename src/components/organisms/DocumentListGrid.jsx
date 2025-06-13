import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const DocumentListGrid = ({ documents, onEdit, onDelete }) => {
  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'FileText';
      case 'doc': case 'docx': return 'FileText';
      case 'xls': case 'xlsx': return 'FileSpreadsheet';
      case 'jpg': case 'jpeg': case 'png': case 'gif': return 'Image';
      default: return 'File';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {documents.map((document, index) => (
        <motion.div
          key={document.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
                  <ApperIcon name={getFileIcon(document.name)} className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <Text as="h3" className="font-medium text-gray-900 truncate">{document.name}</Text>
                  <Text as="p" className="text-sm text-gray-500">{document.category}</Text>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => onEdit(document)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ApperIcon name="Edit" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(document.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <Text as="span" className="text-gray-600">Uploaded</Text>
                <Text as="span" className="text-gray-900">{new Date(document.uploadDate).toLocaleDateString()}</Text>
              </div>
              <div className="flex items-center justify-between text-sm">
                <Text as="span" className="text-gray-600">Size</Text>
                <Text as="span" className="text-gray-900">{formatFileSize(document.size)}</Text>
              </div>
            </div>

            {document.tags?.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {document.tags.map(tag => (
                    <Badge key={tag} variant="default">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                onClick={() => window.open(document.fileUrl, '_blank')}
                className="flex-1"
                variant="secondary"
                size="sm"
                icon="Eye"
                iconPosition="left"
              >
                View
              </Button>
              <Button
                onClick={() => window.open(document.fileUrl, '_blank')}
                className="flex-1"
                variant="primary"
                size="sm"
                icon="Download"
                iconPosition="left"
              >
                Download
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DocumentListGrid;