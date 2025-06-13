import { useState, useEffect } from 'react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Text from '@/components/atoms/Text';

const DocumentForm = ({ onSubmit, onCancel, editingDocument }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Contracts',
    tags: [],
    fileUrl: ''
  });

  const categories = ['Contracts', 'Permits', 'Safety', 'Insurance', 'Compliance', 'Licenses', 'Manuals', 'Other'];
  const commonTags = ['Important', 'Urgent', 'Legal', 'Safety', 'Reference', 'Template', 'Archive'];

  useEffect(() => {
    if (editingDocument) {
      setFormData({
        name: editingDocument.name,
        category: editingDocument.category,
        tags: editingDocument.tags || [],
        fileUrl: editingDocument.fileUrl
      });
    } else {
      setFormData({
        name: '',
        category: 'Contracts',
        tags: [],
        fileUrl: ''
      });
    }
  }, [editingDocument]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag) => {
    const currentTags = formData.tags || [];
    if (currentTags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: currentTags.filter(t => t !== tag)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        tags: [...currentTags, tag]
      }));
    }
  };

  const handleSubmitInternal = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmitInternal} className="space-y-6">
      <FormField
        label="Document Name"
        id="documentName"
        type="text"
        name="name"
        required
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter document name"
      />

      <FormField label="Category" id="documentCategory">
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
        label="File URL"
        id="fileUrl"
        type="url"
        name="fileUrl"
        required
        value={formData.fileUrl}
        onChange={handleChange}
        placeholder="https://example.com/document.pdf"
      />

      <FormField label="Tags" id="documentTags">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {commonTags.map(tag => (
            <label key={tag} className="flex items-center space-x-2 cursor-pointer">
              <Input
                type="checkbox"
                checked={(formData.tags || []).includes(tag)}
                onChange={() => handleTagToggle(tag)}
              />
              <Text as="span" className="text-sm text-gray-700">{tag}</Text>
            </label>
          ))}
        </div>
      </FormField>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {editingDocument ? 'Update Document' : 'Upload Document'}
        </Button>
      </div>
    </form>
  );
};

export default DocumentForm;