import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { documentService } from '@/services';

import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Spinner from '@/components/atoms/Spinner';
import AlertMessage from '@/components/molecules/AlertMessage';
import EmptyState from '@/components/molecules/EmptyState';
import Modal from '@/components/molecules/Modal';
import DocumentForm from '@/components/organisms/DocumentForm';
import DocumentListGrid from '@/components/organisms/DocumentListGrid';

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['Contracts', 'Permits', 'Safety', 'Insurance', 'Compliance', 'Licenses', 'Manuals', 'Other'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const documentsData = await documentService.getAll();
      setDocuments(documentsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDocument = async (documentData) => {
    try {
      const payload = {
        ...documentData,
        uploadDate: new Date().toISOString().split('T')[0],
        size: Math.floor(Math.random() * 5000) + 100 // Mock file size
      };

      if (editingDocument) {
        await documentService.update(editingDocument.id, payload);
        setDocuments(documents.map(d => d.id === editingDocument.id ? { ...d, ...payload } : d));
        toast.success('Document updated successfully');
      } else {
        const newDocument = await documentService.create(payload);
        setDocuments([...documents, newDocument]);
        toast.success('Document uploaded successfully');
      }

      setShowModal(false);
      setEditingDocument(null);
    } catch (err) {
      toast.error('Failed to save document');
    }
  };

  const handleDeleteDocument = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentService.delete(id);
        setDocuments(documents.filter(d => d.id !== id));
        toast.success('Document deleted successfully');
      } catch (err) {
        toast.error('Failed to delete document');
      }
    }
  };

  const openAddModal = () => {
    setEditingDocument(null);
    setShowModal(true);
  };

  const openEditModal = (document) => {
    setEditingDocument(document);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDocument(null);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <AlertMessage
          title="Error Loading Documents"
          message={error}
          onRetry={loadData}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Text as="h1" className="text-3xl font-bold font-display text-secondary mb-2">Documents</Text>
          <Text as="p" className="text-gray-600">Manage your business documents and files</Text>
        </div>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openAddModal}
          variant="primary"
          icon="Upload"
          iconPosition="left"
        >
          Upload Document
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setSelectedCategory('All')}
              className={`!px-3 !py-1 !text-sm font-medium transition-colors ${
                selectedCategory === 'All'
                  ? '!bg-primary !text-white'
                  : '!bg-gray-100 !text-gray-700 hover:!bg-gray-200'
              }`}
              variant="ghost" // override base styles
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`!px-3 !py-1 !text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? '!bg-primary !text-white'
                    : '!bg-gray-100 !text-gray-700 hover:!bg-gray-200'
                }`}
                variant="ghost" // override base styles
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <EmptyState
          icon="FileText"
          title={searchTerm || selectedCategory !== 'All' ? 'No documents found' : 'No documents yet'}
          description={searchTerm || selectedCategory !== 'All'
            ? 'Try adjusting your search or filters'
            : 'Upload your first document to get started'
          }
          buttonText="Upload Document"
          onButtonClick={openAddModal}
        />
      ) : (
        <DocumentListGrid
          documents={filteredDocuments}
          onEdit={openEditModal}
          onDelete={handleDeleteDocument}
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingDocument ? 'Edit Document' : 'Upload Document'}
      >
        <DocumentForm
          onSubmit={handleSaveDocument}
          onCancel={closeModal}
          editingDocument={editingDocument}
        />
      </Modal>
    </div>
  );
};

export default DocumentsPage;