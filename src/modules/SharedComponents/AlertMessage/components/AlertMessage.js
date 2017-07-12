import React from 'react';
import PropTypes from 'prop-types';

const AlertMessage = ({title, message, context}) => {
    const contextClassName = `alert alert-${context}`;
    return (
        <div className={contextClassName} role="alert">
            <strong>{title}</strong>
            {message}
        </div>
    );
};

AlertMessage.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    context: PropTypes.oneOf(['success', 'info', 'warning', 'danger'])
};

export default AlertMessage;


