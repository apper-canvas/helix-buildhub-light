import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Text from '@/components/atoms/Text';

const SettingsCompanyInfo = ({ settings, onSave, onInputChange }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Text as="h2" className="text-xl font-semibold text-gray-900">Company Information</Text>
        <Button onClick={() => onSave('company')} variant="primary">
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Company Name"
          id="companyName"
          type="text"
          value={settings.company.name}
          onChange={(e) => onInputChange('company', 'name', e.target.value)}
        />

        <FormField
          label="Email Address"
          id="companyEmail"
          type="email"
          value={settings.company.email}
          onChange={(e) => onInputChange('company', 'email', e.target.value)}
        />

        <FormField
          label="Phone Number"
          id="companyPhone"
          type="tel"
          value={settings.company.phone}
          onChange={(e) => onInputChange('company', 'phone', e.target.value)}
        />

        <FormField
          label="Website"
          id="companyWebsite"
          type="url"
          value={settings.company.website}
          onChange={(e) => onInputChange('company', 'website', e.target.value)}
        />

        <FormField
          label="Business Address"
          id="companyAddress"
          type="textarea"
          value={settings.company.address}
          onChange={(e) => onInputChange('company', 'address', e.target.value)}
          rows="3"
          className="md:col-span-2"
        />

        <FormField
          label="Tax ID / EIN"
          id="companyTaxId"
          type="text"
          value={settings.company.taxId}
          onChange={(e) => onInputChange('company', 'taxId', e.target.value)}
        />
      </div>
    </div>
  );
};

export default SettingsCompanyInfo;