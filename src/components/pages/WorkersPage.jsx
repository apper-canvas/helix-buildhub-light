import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { workerService, projectService } from '@/services';

import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Spinner from '@/components/atoms/Spinner';
import AlertMessage from '@/components/molecules/AlertMessage';
import EmptyState from '@/components/molecules/EmptyState';
import Modal from '@/components/molecules/Modal';
import KPICard from '@/components/molecules/KPICard';
import WorkerForm from '@/components/organisms/WorkerForm';
import WorkerListGrid from '@/components/organisms/WorkerListGrid';

const WorkersPage = () => {
  const [workers, setWorkers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [workersData, projectsData] = await Promise.all([
        workerService.getAll(),
        projectService.getAll()
      ]);
      setWorkers(workersData);
      setProjects(projectsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load workers');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWorker = async (workerData) => {
    try {
      if (editingWorker) {
        await workerService.update(editingWorker.id, workerData);
        setWorkers(workers.map(w => w.id === editingWorker.id ? { ...w, ...workerData } : w));
        toast.success('Worker updated successfully');
      } else {
        const newWorker = await workerService.create(workerData);
        setWorkers([...workers, newWorker]);
        toast.success('Worker created successfully');
      }

      setShowModal(false);
      setEditingWorker(null);
    } catch (err) {
      toast.error('Failed to save worker');
    }
  };

  const handleDeleteWorker = async (id) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      try {
        await workerService.delete(id);
        setWorkers(workers.filter(w => w.id !== id));
        toast.success('Worker deleted successfully');
      } catch (err) {
        toast.error('Failed to delete worker');
      }
    }
  };

  const openAddModal = () => {
    setEditingWorker(null);
    setShowModal(true);
  };

  const openEditModal = (worker) => {
    setEditingWorker(worker);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingWorker(null);
  };

  const availableWorkers = workers.filter(w => (w.projectIds || []).length === 0).length;
  const totalWorkers = workers.length;
  const averageRate = workers.reduce((sum, w) => sum + (w.dailyRate || 0), 0) / (workers.length || 1);

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
          title="Error Loading Workers"
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
          <Text as="h1" className="text-3xl font-bold font-display text-secondary mb-2">Workers</Text>
          <Text as="p" className="text-gray-600">Manage your workforce and assignments</Text>
        </div>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openAddModal}
          variant="primary"
          icon="Plus"
          iconPosition="left"
        >
          Add Worker
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard
          title="Total Workers"
          value={totalWorkers}
          icon="Users"
          color="bg-primary"
        />
        <KPICard
          title="Available"
          value={availableWorkers}
          icon="UserCheck"
          color="bg-success"
        />
        <KPICard
          title="Avg. Daily Rate"
          value={`$${averageRate.toFixed(0)}`}
          icon="DollarSign"
          color="bg-accent"
        />
      </div>

      {/* Workers List */}
      {workers.length === 0 ? (
        <EmptyState
          icon="HardHat"
          title="No workers yet"
          description="Add your first worker to get started"
          buttonText="Add Worker"
          onButtonClick={openAddModal}
        />
      ) : (
        <WorkerListGrid
          workers={workers}
          projects={projects}
          onEdit={openEditModal}
          onDelete={handleDeleteWorker}
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingWorker ? 'Edit Worker' : 'New Worker'}
      >
        <WorkerForm
          onSubmit={handleSaveWorker}
          onCancel={closeModal}
          editingWorker={editingWorker}
          projects={projects}
        />
      </Modal>
    </div>
  );
};

export default WorkersPage;