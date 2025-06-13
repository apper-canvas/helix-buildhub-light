import { useState, useEffect } from 'react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

const ExpenseForm = ({ onSubmit, onCancel, editingExpense, projects }) => {
  const [formData, setFormData] = useState({
    projectId: '',
    category: 'Materials',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    receipt: ''
  });

  const categories = ['Materials', 'Labor', 'Transportation', 'Equipment', 'Permits', 'Other'];

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        projectId: editingExpense.projectId,
        category: editingExpense.category,
        amount: editingExpense.amount.toString(),
        date: editingExpense.date,
        description: editingExpense.description,
        receipt: editingExpense.receipt || ''
      });
    } else {
      setFormData({
        projectId: '',
        category: 'Materials',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        receipt: ''
      });
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitInternal = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount) || 0
    });
  };

  return (
    <form onSubmit={handleSubmitInternal} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Project" id="expenseProject">
          <Input
            type="select"
            name="projectId"
            required
            value={formData.projectId}
            onChange={handleChange}
          >
            <option value="">Select project</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </Input>
        </FormField>

        <FormField label="Category" id="expenseCategory">
          <Input
            type="select"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Input>
        </FormField>

        <FormField
          label="Amount"
          id="expenseAmount"
          type="number"
          name="amount"
          min="0"
          step="0.01"
          required
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
        />

        <FormField
          label="Date"
          id="expenseDate"
          type="date"
          name="date"
          required
          value={formData.date}
          onChange={handleChange}
        />

        <FormField
          label="Description"
          id="expenseDescription"
          type="textarea"
          name="description"
          required
          value={formData.description}
          onChange={handleChange}
          rows="3"
          placeholder="Describe the expense..."
          className="md:col-span-2"
        />

        <FormField
          label="Receipt/Invoice"
          id="expenseReceipt"
          type="text"
          name="receipt"
          value={formData.receipt}
          onChange={handleChange}
          placeholder="Receipt number or file reference"
          className="md:col-span-2"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {editingExpense ? 'Update Expense' : 'Add Expense'}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;