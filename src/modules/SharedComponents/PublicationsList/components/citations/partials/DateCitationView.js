import React from 'react';
import PropTypes from 'prop-types';

const YearCitationView = ({date, prefix, suffix, format}) => {
    if (!date) return (<span className="citationYear empty nodate" />);
    const thisDate = new Date(date);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const year = thisDate.getFullYear();
    const month = thisDate.getMonth();
    const day = thisDate.getDate();

    // If its an invalid date input
    if (!thisDate || (isNaN(year) || isNaN(month) || isNaN(day))) return (<span className="citationDate empty error" />);

    // Newspaper Article Format: Year, Month Day - 2011, January 1
    if(format === 'newspaperArticle') {
        return (<span className="citationDate newspaperArticle">{prefix}{year}, {monthNames[month]} {day}{suffix}</span>);
    }

    // Default date format: Day Month, Year - 12 January 2011
    return (<span className="citationDate">{prefix}{day} {monthNames[month]} {year}{suffix}</span>);
};

YearCitationView.propTypes = {
    date: PropTypes.string,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
    format: PropTypes.string
};

YearCitationView.defaultProps = {
    prefix: '(',
    suffix: ').'
};

export default YearCitationView;
