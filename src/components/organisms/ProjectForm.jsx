import { useState, useEffect } from 'react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

const ProjectForm = ({ onSubmit, onCancel, editingProject, clients, workers }) => {
  const [formData, setFormData] = useState({
    name: '',
    clientId: '',
    startDate: '',
    deadline: '',
    status: 'Planning',
    budget: '',
    workerIds: [],
    phase: 'Planning',
    notes: ''
  });

  const statusOptions = ['Planning', 'Active', 'Completed', 'On Hold'];
  const phaseOptions = ['Planning', 'Foundation', 'Framing', 'Finishing', 'Completed'];

  useEffect(() => {
    if (editingProject) {
      setFormData({
        name: editingProject.name,
        clientId: editingProject.clientId,
        startDate: editingProject.startDate,
        deadline: editingProject.deadline,
        status: editingProject.status,
        budget: editingProject.budget?.toString() || '',
        workerIds: editingProject.workerIds || [],
        phase: editingProject.phase,
        notes: editingProject.notes || ''
      });
    } else {
      setFormData({
        name: '',
        clientId: '',
        startDate: '',
        deadline: '',
        status: 'Planning',
        budget: '',
        workerIds: [],
        phase: 'Planning',
        notes: ''
      });
    }
  }, [editingProject]);

  const handleChange = (e) => {
    const { name, value, options } = e.target;
    if (name === 'workerIds') {
      const selectedWorkers = Array.from(options).filter(option => option.selected).map(option => option.value);
      setFormData(prev => ({ ...prev, [name]: selectedWorkers }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitInternal = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmitInternal} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Project Name"
          id="projectName"
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter project name"
        />

        <FormField label="Client" id="projectClient">
          <Input
            type="select"
            name="clientId"
            required
            value={formData.clientId}
            onChange={handleChange}
          >
            <option value="">Select client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.companyName}</option>
            ))}
          </Input>
        </FormField>

        <FormField
          label="Start Date"
          id="startDate"
          type="date"
          name="startDate"
          required
          value={formData.startDate}
          onChange={handleChange}
        />

        <FormField
          label="Deadline"
          id="deadline"
          type="date"
          name="deadline"
          required
          value={formData.deadline}
          onChange={handleChange}
        />

        <FormField label="Status" id="projectStatus">
          <Input
            type="select"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </Input>
        </FormField>

        <FormField label="Phase" id="projectPhase">
          <Input
            type="select"
            name="phase"
            value={formData.phase}
            onChange={handleChange}
          >
            {phaseOptions.map(phase => (
              <option key={phase} value={phase}>{phase}</option>
            ))}
          </Input>
        </FormField>

        <FormField
          label="Budget"
          id="projectBudget"
          type="number"
          name="budget"
          min="0"
          step="0.01"
          value={formData.budget}
          onChange={handleChange}
          placeholder="0.00"
          className="md:col-span-2"
        />
        
        <FormField label="Assigned Workers" id="projectWorkers" className="md:col-span-2">
            <Input
              type="select"
              name="workerIds"
              multiple
              value={formData.workerIds}
              onChange={handleChange}
              size="3"
            >
              {workers.map(worker => (
                <option key={worker.id} value={worker.id}>{worker.name} ({worker.role})</option>
              ))}
            </Input>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple workers</p>
        </FormField>

        <FormField
          label="Notes"
          id="projectNotes"
          type="textarea"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          placeholder="Project notes..."
          className="md:col-span-2"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {editingProject ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;