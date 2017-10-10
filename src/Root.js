import React from 'react';
import {ConnectedRouter} from 'connected-react-router/immutable';
import {Route, Switch} from 'react-router';
import PropTypes from 'prop-types';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {theme} from 'config';

// Top level "pages"
import {App} from 'modules/App';
import {ScrollToTop} from 'modules/SharedComponents';

const Root = ({history}) => {
    return (
        <ConnectedRouter history={history}>
            <ScrollToTop>
                <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
                    <Switch>
                        <Route component={App} />
                    </Switch>
                </MuiThemeProvider>
            </ScrollToTop>
        </ConnectedRouter>
    );
};

Root.propTypes = {
    history: PropTypes.object,
};

export default Root;
