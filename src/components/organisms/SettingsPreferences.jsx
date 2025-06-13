import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import Input from '@/components/atoms/Input';

const SettingsPreferences = ({ settings, onSave, onInputChange }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Text as="h2" className="text-xl font-semibold text-gray-900">Application Preferences</Text>
        <Button onClick={() => onSave('preferences')} variant="primary">
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Text as="label" htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
            Theme
          </Text>
          <Input
            id="theme"
            type="select"
            value={settings.preferences.theme}
            onChange={(e) => onInputChange('preferences', 'theme', e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </Input>
        </div>

        <div>
          <Text as="label" htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </Text>
          <Input
            id="language"
            type="select"
            value={settings.preferences.language}
            onChange={(e) => onInputChange('preferences', 'language', e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </Input>
        </div>

        <div>
          <Text as="label" htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-2">
            Date Format
          </Text>
          <Input
            id="dateFormat"
            type="select"
            value={settings.preferences.dateFormat}
            onChange={(e) => onInputChange('preferences', 'dateFormat', e.target.value)}
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </Input>
        </div>

        <div>
          <Text as="label" htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </Text>
          <Input
            id="currency"
            type="select"
            value={settings.preferences.currency}
            onChange={(e) => onInputChange('preferences', 'currency', e.target.value)}
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="CAD">CAD - Canadian Dollar</option>
          </Input>
        </div>

        <div>
          <Text as="label" htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </Text>
          <Input
            id="timezone"
            type="select"
            value={settings.preferences.timezone}
            onChange={(e) => onInputChange('preferences', 'timezone', e.target.value)}
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="UTC">UTC</option>
          </Input>
        </div>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <ApperIcon name="Info" className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <Text as="h3" className="font-medium text-blue-800">Preference Notes</Text>
            <Text as="p" className="mt-1 text-sm text-blue-700">
              Changes to theme and language will take effect immediately. 
              Date format and currency changes will apply to new data entries.
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPreferences;