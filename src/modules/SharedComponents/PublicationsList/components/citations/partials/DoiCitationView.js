import React from 'react';
import PropTypes from 'prop-types';

const DoiCitationView = ({doi}) => {
    if (!doi) return (<span className="citationDOI empty" />);

    return (
        <span className="citationDOI">
            <span className="citationLabel">doi: </span>
            <span className="citationValue">{doi}</span>
        </span>
    );
};

DoiCitationView.propTypes = {
    doi: PropTypes.string
};

export default DoiCitationView;
