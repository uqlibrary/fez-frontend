import React from 'react';
import PropTypes from 'prop-types';

// Using moment.js to format the date - https://momentjs.com/
const moment = require('moment');

const DateCitationView = ({date, prefix, suffix, format, className}) => {
    // If there is no date, or it is invalid
    if (!date || !moment(date).isValid()) return (<span className="citationDate empty" />);
    return (<span className={className}>{prefix}{moment(date).format(format)}{suffix}</span>);
};

DateCitationView.propTypes = {
    date: PropTypes.string,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
    format: PropTypes.string,
    className: PropTypes.string
};

DateCitationView.defaultProps = {
    format: 'YYYY',
    prefix: '(',
    suffix: ').',
    className: 'DateCitationView'
};

export default DateCitationView;
