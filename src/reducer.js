import {combineReducers} from 'redux-immutable';
import {reducer as formReducer} from 'redux-form/immutable';

// Load reducers
import {appReducer} from 'modules/App';
import {authorsReducer, helpDrawerReducer} from 'uqlibrary-react-toolbox';
import {reducer as dashboardReducer} from 'modules/Dashboard';
import {publicationTypeReducer, publicationSubTypeReducer} from './modules/Forms';

const rootReducer = combineReducers({
    form: formReducer,
    // App reducers
    app: appReducer,
    authors: authorsReducer,
    dashboard: dashboardReducer,
    helpDrawer: helpDrawerReducer,
    publicationTypes: publicationTypeReducer,
    publicationSubTypes: publicationSubTypeReducer
});

export default rootReducer;
