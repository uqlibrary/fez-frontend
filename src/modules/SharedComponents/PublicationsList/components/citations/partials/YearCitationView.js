import React from 'react';
import PropTypes from 'prop-types';

const YearCitationView = ({date}) => {
    if (!date) return (<span className="citationYear empty" />);

    const year = !isNaN(new Date(date))
        ? new Date(date)
        : new Date(date.replace(/-/g, '/'));

    if (!year || isNaN(year.getFullYear())) return (<span className="citationYear empty" />);
    return (<span className="citationYear">({year.getFullYear()}).</span>);
};

YearCitationView.propTypes = {
    date: PropTypes.string
};

export default YearCitationView;
