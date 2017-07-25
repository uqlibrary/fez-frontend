import {connect} from 'react-redux';

import App from '../components/App';
import {loadAccount, toggleDrawer} from '../actions';

const AppContainer = connect(state => {
    const appState = state.get('app');
    return {
        error: appState.get('error'),
        account: appState.get('account'),
        loaded: appState.get('accountLoaded'),
        menuDrawerOpen: appState.get('menuDrawerOpen'),
    };
}, dispatch => {
    return {
        loadAccount: () => dispatch(loadAccount()),
        toggleMenuDrawer: open => dispatch(toggleDrawer(open))
    };
})(App);

export default AppContainer;
