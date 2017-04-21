import {combineReducers} from 'redux-immutable';

// Load reducers
import {reducer as formReducer} from 'redux-form/immutable';
import {appReducer} from 'modules/App';
import {reducer as dashboardReducer} from 'modules/Dashboard';
import {helpDrawerReducer} from 'uqlibrary-react-toolbox';
import {publicationSearchReducer} from 'modules/Forms';

const rootReducer = combineReducers({
    form: formReducer,
    // App reducers
    app: appReducer,
    dashboard: dashboardReducer,
    helpDrawer: helpDrawerReducer,
    publicationSearch: publicationSearchReducer,
});

export default rootReducer;
