import React from 'react';
import PropTypes from 'prop-types';

const CitationView = ({className, prefix = ' ', suffix = '.', value}) => {
    if (!value) return (<span className={`${className || ''} empty`} />);
    return (
        <span className={className || ''}>
            {prefix}{value}{suffix === value.slice(-1) ? '' : suffix}
        </span>
    );
};

CitationView.propTypes = {
    prefix: PropTypes.string,
    suffix: PropTypes.string,
    className: PropTypes.string,
    value: PropTypes.string
};

export default CitationView;
