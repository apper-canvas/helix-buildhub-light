import { useState, useEffect } from 'react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

const ClientForm = ({ onSubmit, onCancel, editingClient }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    if (editingClient) {
      setFormData({
        companyName: editingClient.companyName,
        contactPerson: editingClient.contactPerson,
        email: editingClient.email,
        phone: editingClient.phone,
        address: editingClient.address,
        notes: editingClient.notes || ''
      });
    } else {
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
      });
    }
  }, [editingClient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitInternal = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmitInternal} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Company Name"
          id="companyName"
          type="text"
          name="companyName"
          required
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Enter company name"
        />

        <FormField
          label="Contact Person"
          id="contactPerson"
          type="text"
          name="contactPerson"
          required
          value={formData.contactPerson}
          onChange={handleChange}
          placeholder="Enter contact person"
        />

        <FormField
          label="Email"
          id="clientEmail"
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email address"
        />

        <FormField
          label="Phone"
          id="clientPhone"
          type="tel"
          name="phone"
          required
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
        />

        <FormField
          label="Address"
          id="clientAddress"
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter address"
          className="md:col-span-2"
        />

        <FormField
          label="Notes"
          id="clientNotes"
          type="textarea"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          placeholder="Additional notes..."
          className="md:col-span-2"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {editingClient ? 'Update Client' : 'Create Client'}
        </Button>
      </div>
    </form>
  );
};

export default ClientForm;