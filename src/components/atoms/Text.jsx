const Text = ({ as = 'p', className = '', children, ...props }) => {
  const Tag = as;
  return (
    <Tag className={className} {...props}>
      {children}
    </Tag>
  );
};

export default Text;