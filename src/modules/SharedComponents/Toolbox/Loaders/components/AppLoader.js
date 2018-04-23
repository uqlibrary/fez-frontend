import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';

export default function AppLoader({title, logoImage, logoText, progressColor}) {
    return (
        <div className="app-loader columns is-gapless layout-fill" >
            <div className="app-loader-content column is-centered">
                <h1 className="title is-2 color-reverse">{title}</h1>
                <br />
                <br />
                <CircularProgress size={80} thickness={8} color={progressColor} />
                <br />
                <br />
                {logoImage && <img src={logoImage} alt={logoText} />}
            </div>
        </div>
    );
}

AppLoader.propTypes = {
    title: PropTypes.string.isRequired,
    logoImage: PropTypes.string,
    logoText: PropTypes.string,
    progressColor: PropTypes.string
};

AppLoader.defaultProps = {
    progressColor: '#FFF'
};
