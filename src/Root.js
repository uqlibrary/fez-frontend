import React, {PropTypes} from 'react';
import {ConnectedRouter} from 'connected-react-router/immutable';
import {Route, Switch} from 'react-router';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {theme} from 'config';

// Top level "pages"
import {App} from 'modules/App';

// Forms
import {ClaimPublicationForm} from 'modules/Forms';

const Root = ({ history }) => {
    return (
        <ConnectedRouter history={history}>
            <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
                <Switch>
                    <Route path="/claim-publications/:id" component={ClaimPublicationForm}/>
                    <Route component={App} />
                </Switch>
            </MuiThemeProvider>
        </ConnectedRouter>
    );
};

Root.propTypes = {
    history: PropTypes.object,
};

export default Root;
