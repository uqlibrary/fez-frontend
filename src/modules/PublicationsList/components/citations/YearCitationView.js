import React from 'react';
import PropTypes from 'prop-types';

const YearCitationView = ({publication}) => {
    console.log(publication.rek_date);
    if (!publication.rek_date) return (<span className="citationYear empty" />);

    const year = !isNaN(new Date(publication.rek_date))
        ? new Date(publication.rek_date)
        : new Date(publication.rek_date.replace(/-/g, '/'));

    if (!year || isNaN(year.getFullYear())) return (<span className="citationYear empty" />);
    return (<span className="citationYear"> ({year.getFullYear()}) </span>);
};

YearCitationView.propTypes = {
    publication: PropTypes.object.isRequired
};

export default YearCitationView;
