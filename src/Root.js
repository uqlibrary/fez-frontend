import React from 'react';
import {ConnectedRouter} from 'connected-react-router/immutable';
import {Route, Switch} from 'react-router';
import PropTypes from 'prop-types';
// MUI1
import {mui1theme} from 'config';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';


// Top level "pages"
import {App} from 'modules/App';
import {ScrollToTop} from 'modules/SharedComponents/Toolbox/ScrollToTop';

const Root = ({history}) => {
    return (
        <ConnectedRouter history={history}>
            <ScrollToTop>
                <MuiThemeProvider theme={mui1theme}>
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
