import { useState, useEffect } from 'react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Text from '@/components/atoms/Text';

const WorkerForm = ({ onSubmit, onCancel, editingWorker, projects }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    phone: '',
    email: '',
    projectIds: [],
    dailyRate: '',
    skills: []
  });

  const commonRoles = ['Site Manager', 'Carpenter', 'Electrician', 'Plumber', 'Laborer', 'Heavy Equipment Operator', 'Foreman'];
  const commonSkills = ['Carpentry', 'Electrical', 'Plumbing', 'Masonry', 'Welding', 'Heavy Equipment', 'Safety', 'Project Management'];

  useEffect(() => {
    if (editingWorker) {
      setFormData({
        name: editingWorker.name,
        role: editingWorker.role,
        phone: editingWorker.phone,
        email: editingWorker.email,
        projectIds: editingWorker.projectIds || [],
        dailyRate: editingWorker.dailyRate?.toString() || '',
        skills: editingWorker.skills || []
      });
    } else {
      setFormData({
        name: '',
        role: '',
        phone: '',
        email: '',
        projectIds: [],
        dailyRate: '',
        skills: []
      });
    }
  }, [editingWorker]);

  const handleChange = (e) => {
    const { name, value, options } = e.target;
    if (name === 'projectIds') {
      const selectedProjects = Array.from(options).filter(option => option.selected).map(option => option.value);
      setFormData(prev => ({ ...prev, [name]: selectedProjects }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSkillToggle = (skill) => {
    const currentSkills = formData.skills || [];
    if (currentSkills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: currentSkills.filter(s => s !== skill)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        skills: [...currentSkills, skill]
      }));
    }
  };

  const handleSubmitInternal = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      dailyRate: parseFloat(formData.dailyRate) || 0
    });
  };

  return (
    <form onSubmit={handleSubmitInternal} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Name"
          id="workerName"
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter worker name"
        />

        <FormField label="Role" id="workerRole">
          <Input
            type="select"
            name="role"
            required
            value={formData.role}
            onChange={handleChange}
          >
            <option value="">Select role</option>
            {commonRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </Input>
        </FormField>

        <FormField
          label="Phone"
          id="workerPhone"
          type="tel"
          name="phone"
          required
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
        />

        <FormField
          label="Email"
          id="workerEmail"
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email address"
        />

        <FormField
          label="Daily Rate ($)"
          id="dailyRate"
          type="number"
          name="dailyRate"
          min="0"
          step="0.01"
          value={formData.dailyRate}
          onChange={handleChange}
          placeholder="0.00"
        />

        <FormField label="Project Assignments" id="workerProjects">
          <Input
            type="select"
            name="projectIds"
            multiple
            value={formData.projectIds}
            onChange={handleChange}
            size="3"
          >
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </Input>
          <Text className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple projects</Text>
        </FormField>

        <FormField label="Skills" id="workerSkills" className="md:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {commonSkills.map(skill => (
              <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                <Input
                  type="checkbox"
                  checked={(formData.skills || []).includes(skill)}
                  onChange={() => handleSkillToggle(skill)}
                />
                <Text as="span" className="text-sm text-gray-700">{skill}</Text>
              </label>
            ))}
          </div>
        </FormField>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {editingWorker ? 'Update Worker' : 'Add Worker'}
        </Button>
      </div>
    </form>
  );
};

export default WorkerForm;