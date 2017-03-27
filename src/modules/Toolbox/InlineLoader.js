import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const propTypes = {
    message: React.PropTypes.string
};

export default function InlineLoader({message}) {
    return (
        <div className="column align-center">
            <br /><br />
            <CircularProgress size={60} thickness={8} /> <br /><br />
            <span className="headline">{message}</span> <br /><br />
        </div>
    );
}

InlineLoader.propTypes = propTypes;
