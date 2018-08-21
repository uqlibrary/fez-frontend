import React from 'react';
import {ConnectedRouter} from 'connected-react-router/immutable';
import {Route, Switch} from 'react-router';
import PropTypes from 'prop-types';
import { MuiThemeProvider as V0MuiThemeProvider} from 'material-ui';
// MUI1
import {mui1theme, oldtheme} from 'config';
import { MuiThemeProvider } from '@material-ui/core/styles';


// Top level "pages"
import {App} from 'modules/App';
import {ScrollToTop} from 'modules/SharedComponents/Toolbox/ScrollToTop';

const Root = ({history}) => {
    return (
        <ConnectedRouter history={history}>
            <ScrollToTop>
                <MuiThemeProvider theme={mui1theme}>
                    <V0MuiThemeProvider muiTheme={oldtheme}>
                        <Switch>
                            <Route component={App} />
                        </Switch>
                    </V0MuiThemeProvider>
                </MuiThemeProvider>
            </ScrollToTop>
        </ConnectedRouter>
    );
};

Root.propTypes = {
    history: PropTypes.object,
};

export default Root;
