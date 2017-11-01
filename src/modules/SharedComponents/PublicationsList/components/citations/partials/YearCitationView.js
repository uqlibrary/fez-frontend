import React from 'react';
import PropTypes from 'prop-types';

const YearCitationView = ({date, prefix, suffix}) => {
    if (!date) return (<span className="citationYear empty" />);

    const year = !isNaN(new Date(date))
        ? new Date(date)
        : new Date(date.replace(/-/g, '/'));

    if (!year || isNaN(year.getFullYear())) return (<span className="citationYear empty" />);
    return (<span className="citationYear">{prefix}{year.getFullYear()}{suffix}</span>);
};

YearCitationView.propTypes = {
    date: PropTypes.string,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
};

YearCitationView.defaultProps = {
    prefix: '(',
    suffix: ').'
};

export default YearCitationView;
