import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';

export default function InlineLoader({message}) {
    return (
        <div className="column align-center">
            <br /><br />
            <CircularProgress size={60} thickness={8} /> <br /><br />
            <span className="cardTitle">{message}</span> <br /><br />
        </div>
    );
}

InlineLoader.propTypes = {
    message: PropTypes.string
};

InlineLoader.defaultProps = {
    message: 'Loading...'
};
