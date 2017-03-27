import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

import './AppLoader.scss';

export default function AppLoader() {
    return (
        <div className="app-loader column layout-fill align-center justify-center">
            <h1 className="display-2">UQ eSpace</h1> <br /><br />
            <CircularProgress size={80} thickness={8} color="#FFF" /> <br /><br />
            <img src="https://static.uq.net.au/v1/logos/corporate/uq-logo-white.svg" width="300px" alt="University of Queensland logo" />
        </div>
    );
}
