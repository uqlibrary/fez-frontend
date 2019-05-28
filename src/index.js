// External
import '@babel/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {connectRouter} from 'connected-react-router/immutable';
import {AppContainer} from 'react-hot-loader';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
// pick utils
import MomentUtils from 'material-ui-pickers/utils/moment-utils';

// Internal
import Root from './Root';
import AppErrorBoundary from './AppErrorBoundary';
import rootReducer from './reducer';
import 'sass/index.scss';
import {store, history} from 'config/store';

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
        document.getElementById('react-root')
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
