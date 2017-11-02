import React from 'react';
import PropTypes from 'prop-types';

// Date : 2011-01-06T00:00:00Z
// [Y]  : 2011
// [y]  : 11
// [M]  : January
// [m]  : 1
// [d]  : 6
// [D]  : 6th

// Examples:
// [D] [M], [Y] - 16th January, 2011
// [d]/[m]/[y]  - 16/01/11

// TODO: Assumes there will only be once instance of each token in the format - or we need regex/g replacements

const addOrdinalSuffix = (day) => {
    if(day === 1 || day === 21 || day === 31) {
        return day + 'st';
    } else if (day === 2 || day === 22) {
        return day + 'nd';
    } else if (day === 3 || day === 23) {
        return day + 'rd';
    } else {
        return day + 'th';
    }
};
const convertMonth = (month) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[month];
};

const DateCitationView = ({date, prefix, suffix, format}) => {
    // If there is no date
    if (!date ) return (<span className="citationDate empty" />);

    // If its an invalid date
    const thisDate = new Date(date);
    if (!thisDate || (isNaN(thisDate.getFullYear()) || isNaN(thisDate.getMonth()) || isNaN(thisDate.getDay()))) return (<span className="citationDate invalid" />);

    return (<span className="citationDate">{prefix + format
        .replace('[M]', convertMonth(thisDate.getMonth()))
        .replace('[m]', thisDate.getMonth())
        .replace('[Y]', thisDate.getFullYear())
        .replace('[y]', thisDate.getFullYear().toString().substr(-2))
        .replace('[D]', addOrdinalSuffix(thisDate.getDay()))
        .replace('[d]', thisDate.getDate()) + suffix}</span>);
};

DateCitationView.propTypes = {
    date: PropTypes.string,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
    format: PropTypes.string
};

DateCitationView.defaultProps = {
    format: '[d]/[m]/[y]',
    prefix: '(',
    suffix: ').'
};

export default DateCitationView;
