import React from 'react';
import { Router } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
// MUI1
import { mui1theme } from 'config';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';

// Top level "pages"
import { App } from 'modules/App';
import { ScrollToTop } from 'modules/SharedComponents/Toolbox/ScrollToTop';

const Root = ({ history }) => {
    return (
        <Router history={history}>
            <ScrollToTop>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={mui1theme}>
                        <Switch>
                            <Route component={App} />
                        </Switch>
                    </ThemeProvider>
                </StyledEngineProvider>
            </ScrollToTop>
        </Router>
    );
};

Root.propTypes = {
    history: PropTypes.object,
};

export default Root;
