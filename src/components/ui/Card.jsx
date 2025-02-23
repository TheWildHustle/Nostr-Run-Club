import PropTypes from 'prop-types';

export function Card({ children, className = '' }) {
  Card.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
  };

  return (
    <div className={`relative overflow-hidden bg-black border border-gray-800 ${className}`}>
      {children}
    </div>
  );
} 