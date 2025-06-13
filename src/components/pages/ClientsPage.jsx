import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { clientService, projectService } from '@/services';

import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Spinner from '@/components/atoms/Spinner';
import AlertMessage from '@/components/molecules/AlertMessage';
import EmptyState from '@/components/molecules/EmptyState';
import Modal from '@/components/molecules/Modal';
import ClientForm from '@/components/organisms/ClientForm';
import ClientListGrid from '@/components/organisms/ClientListGrid';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]); // Needed for ClientListGrid to show client's projects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [clientsData, projectsData] = await Promise.all([
        clientService.getAll(),
        projectService.getAll()
      ]);
      setClients(clientsData);
      setProjects(projectsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClient = async (clientData) => {
    try {
      if (editingClient) {
        await clientService.update(editingClient.id, clientData);
        setClients(clients.map(c => c.id === editingClient.id ? { ...c, ...clientData } : c));
        toast.success('Client updated successfully');
      } else {
        const newClient = await clientService.create(clientData);
        setClients([...clients, newClient]);
        toast.success('Client created successfully');
      }

      setShowModal(false);
      setEditingClient(null);
    } catch (err) {
      toast.error('Failed to save client');
    }
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientService.delete(id);
        setClients(clients.filter(c => c.id !== id));
        toast.success('Client deleted successfully');
      } catch (err) {
        toast.error('Failed to delete client');
      }
    }
  };

  const openAddModal = () => {
    setEditingClient(null);
    setShowModal(true);
  };

  const openEditModal = (client) => {
    setEditingClient(client);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClient(null);
  };

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
          title="Error Loading Clients"
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
          <Text as="h1" className="text-3xl font-bold font-display text-secondary mb-2">Clients</Text>
          <Text as="p" className="text-gray-600">Manage your client relationships</Text>
        </div>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openAddModal}
          variant="primary"
          icon="Plus"
          iconPosition="left"
        >
          New Client
        </Button>
      </div>

      {/* Clients List */}
      {clients.length === 0 ? (
        <EmptyState
          icon="Users"
          title="No clients yet"
          description="Add your first client to get started"
          buttonText="Add Client"
          onButtonClick={openAddModal}
        />
      ) : (
        <ClientListGrid
          clients={clients}
          projects={projects} // Pass projects to help render client's related projects
          onEdit={openEditModal}
          onDelete={handleDeleteClient}
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingClient ? 'Edit Client' : 'New Client'}
      >
        <ClientForm
          onSubmit={handleSaveClient}
          onCancel={closeModal}
          editingClient={editingClient}
        />
      </Modal>
    </div>
  );
};

export default ClientsPage;