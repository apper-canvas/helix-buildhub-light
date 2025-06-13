import Input from '@/components/atoms/Input';
import Text from '@/components/atoms/Text';

const FormField = ({ label, id, className = '', children, ...inputProps }) => {
  return (
    <div className={className}>
      {label && (
        <Text as="label" htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </Text>
      )}
      {children ? (
        children
      ) : (
        <Input id={id} {...inputProps} />
      )}
    </div>
  );
};

export default FormField;