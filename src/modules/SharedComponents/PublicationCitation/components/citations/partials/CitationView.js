import React from 'react';
import PropTypes from 'prop-types';

export const CitationView = ({ prefix, suffix, className, value, citationId }) => {
    if (!value) {
        return <span className={`${className || ''} empty`} data-testid={citationId} />;
    }
    return (
        <span className={className || ''} data-testid={citationId}>
            {prefix}
            {value}
            {suffix === value.slice(-1) ? '' : suffix}
        </span>
    );
};
CitationView.propTypes = {
    prefix: PropTypes.string,
    suffix: PropTypes.string,
    className: PropTypes.string,
    value: PropTypes.string,
    citationId: PropTypes.string,
};

CitationView.defaultProps = {
    prefix: ' ',
    suffix: '.',
};
export default React.memo(CitationView);
