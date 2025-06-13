import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { motion } from 'framer-motion';

const ReportsPanel = ({
  selectedPeriod,
  setSelectedPeriod,
  periods,
  exportReport,
  reportTypes,
  selectedReport,
  setSelectedReport
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-secondary mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive business insights and analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <Input
            type="select"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-auto"
          >
            {periods.map(period => (
              <option key={period} value={period}>{period}</option>
            ))}
          </Input>
          <div className="flex space-x-2">
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => exportReport('pdf')}
              variant="primary"
              icon="Download"
              iconPosition="left"
            >
              Export PDF
            </Button>
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => exportReport('excel')}
              variant="success"
              icon="FileSpreadsheet"
              iconPosition="left"
            >
              Export Excel
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-wrap gap-2">
          {reportTypes.map(type => (
            <Button
              key={type.id}
              onClick={() => setSelectedReport(type.id)}
              className={`font-medium ${
                selectedReport === type.id
                  ? '!bg-primary !text-white'
                  : '!bg-gray-100 !text-gray-700 hover:!bg-gray-200'
              }`}
              icon={type.icon}
              iconPosition="left"
              variant="ghost" // Override base variant for custom bg/text
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ReportsPanel;