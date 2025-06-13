import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { projectService, clientService, workerService } from '@/services';

import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Spinner from '@/components/atoms/Spinner';
import AlertMessage from '@/components/molecules/AlertMessage';
import EmptyState from '@/components/molecules/EmptyState';
import Modal from '@/components/molecules/Modal';
import ProjectForm from '@/components/organisms/ProjectForm';
import ProjectListTable from '@/components/organisms/ProjectListTable';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectsData, clientsData, workersData] = await Promise.all([
        projectService.getAll(),
        clientService.getAll(),
        workerService.getAll()
      ]);
      setProjects(projectsData);
      setClients(clientsData);
      setWorkers(workersData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProject = async (projectData) => {
    try {
      const payload = {
        ...projectData,
        budget: parseFloat(projectData.budget) || 0,
        spent: editingProject?.spent || 0
      };

      if (editingProject) {
        await projectService.update(editingProject.id, payload);
        setProjects(projects.map(p => p.id === editingProject.id ? { ...p, ...payload } : p));
        toast.success('Project updated successfully');
      } else {
        const newProject = await projectService.create(payload);
        setProjects([...projects, newProject]);
        toast.success('Project created successfully');
      }

      setShowModal(false);
      setEditingProject(null);
    } catch (err) {
      toast.error('Failed to save project');
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.delete(id);
        setProjects(projects.filter(p => p.id !== id));
        toast.success('Project deleted successfully');
      } catch (err) {
        toast.error('Failed to delete project');
      }
    }
  };

  const openAddModal = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
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
          title="Error Loading Projects"
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
          <Text as="h1" className="text-3xl font-bold font-display text-secondary mb-2">Projects</Text>
          <Text as="p" className="text-gray-600">Manage your construction projects</Text>
        </div>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openAddModal}
          variant="primary"
          icon="Plus"
          iconPosition="left"
        >
          New Project
        </Button>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <EmptyState
          icon="Building2"
          title="No projects yet"
          description="Create your first project to get started"
          buttonText="Create Project"
          onButtonClick={openAddModal}
        />
      ) : (
        <ProjectListTable
          projects={projects}
          clients={clients}
          onEdit={openEditModal}
          onDelete={handleDeleteProject}
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingProject ? 'Edit Project' : 'New Project'}
      >
        <ProjectForm
          onSubmit={handleSaveProject}
          onCancel={closeModal}
          editingProject={editingProject}
          clients={clients}
          workers={workers}
        />
      </Modal>
    </div>
  );
};

export default ProjectsPage;