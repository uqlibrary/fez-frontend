import {combineReducers} from 'redux-immutable';
// import {reducer as formReducer} from 'redux-form/immutable';

// Load reducers
import {appReducer} from 'modules/App';
import {reducer as dashboardReducer} from 'modules/Dashboard';
import {helpDrawerReducer} from 'uqlibrary-react-toolbox';

const rootReducer = combineReducers({
    // App reducers
    app: appReducer,
    dashboard: dashboardReducer,
    helpDrawer: helpDrawerReducer
});

export default rootReducer;
