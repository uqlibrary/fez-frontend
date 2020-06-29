// External
import '@babel/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { connectRouter } from 'connected-react-router/immutable';
import { AppContainer } from 'react-hot-loader';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
// pick utils
import MomentUtils from '@date-io/moment';

// Internal
import Root from './Root';
import AppErrorBoundary from './AppErrorBoundary';
import rootReducer from './reducer';
import 'sass/index.scss';
import { store } from 'config/store';
import { history } from 'config/history';

// Increase default (10) event listeners to 30
require('events').EventEmitter.prototype._maxListeners = 30;

// Import mock data if required
if (process.env.BRANCH !== 'production' && process.env.USE_MOCK) {
    require('./mock');
}

const render = () => {
    ReactDOM.render(
        <AppErrorBoundary>
            <AppContainer>
                <Provider store={store}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <Root history={history} />
                    </MuiPickersUtilsProvider>
                </Provider>
            </AppContainer>
        </AppErrorBoundary>,
        document.getElementById('react-root'),
    );
};

render();

// Hot reloading
if (module.hot) {
    // Reload components
    module.hot.accept('./Root', () => {
        render();
    });

    // Reload reducers
    module.hot.accept('./reducer', () => {
        store.replaceReducer(connectRouter(history)(rootReducer));
    });
}
