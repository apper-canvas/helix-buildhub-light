import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import Input from '@/components/atoms/Input';

const SettingsSecurity = ({ settings, onSave, onInputChange, onToggle }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Text as="h2" className="text-xl font-semibold text-gray-900">Security Settings</Text>
        <Button onClick={() => onSave('security')} variant="primary">
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <Text as="h3" className="font-medium text-gray-900">Two-Factor Authentication</Text>
            <Text as="p" className="text-sm text-gray-500">Add an extra layer of security to your account</Text>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <Input
              type="checkbox"
              className="sr-only peer"
              value={settings.security.twoFactorAuth}
              onChange={() => onToggle('security', 'twoFactorAuth')}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Text as="label" htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 mb-2">
              Session Timeout (minutes)
            </Text>
            <Input
              id="sessionTimeout"
              type="select"
              value={settings.security.sessionTimeout}
              onChange={(e) => onInputChange('security', 'sessionTimeout', e.target.value)}
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </Input>
          </div>

          <div>
            <Text as="label" htmlFor="passwordExpiry" className="block text-sm font-medium text-gray-700 mb-2">
              Password Expiry (days)
            </Text>
            <Input
              id="passwordExpiry"
              type="select"
              value={settings.security.passwordExpiry}
              onChange={(e) => onInputChange('security', 'passwordExpiry', e.target.value)}
            >
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
              <option value="180">180 days</option>
              <option value="never">Never</option>
            </Input>
          </div>

          <div>
            <Text as="label" htmlFor="backupFrequency" className="block text-sm font-medium text-gray-700 mb-2">
              Backup Frequency
            </Text>
            <Input
              id="backupFrequency"
              type="select"
              value={settings.security.backupFrequency}
              onChange={(e) => onInputChange('security', 'backupFrequency', e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Input>
          </div>
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <ApperIcon name="AlertTriangle" className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <Text as="h3" className="font-medium text-yellow-800">Security Recommendations</Text>
              <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside space-y-1">
                <li>Enable two-factor authentication for enhanced security</li>
                <li>Use strong, unique passwords for all accounts</li>
                <li>Regularly review and update security settings</li>
                <li>Keep your application updated to the latest version</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSecurity;