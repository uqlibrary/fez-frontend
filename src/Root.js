import React from 'react';
import {ConnectedRouter} from 'connected-react-router/immutable';
import PropTypes from 'prop-types';
import {BrowserRouter} from 'react-router-dom';
import {renderRoutes} from 'react-router-config';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {theme} from 'config';
import {default as routes} from 'config/routes';
import {ScrollToTop} from './modules/SharedComponents';

const Root = ({history}) => {
    return (
        <ConnectedRouter history={history}>
            <ScrollToTop>
                <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
                    <BrowserRouter>
                        {renderRoutes(routes)}
                    </BrowserRouter>
                </MuiThemeProvider>
            </ScrollToTop>
        </ConnectedRouter>
    );
};

Root.propTypes = {
    history: PropTypes.object,
};

export default Root;
