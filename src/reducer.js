import {combineReducers} from 'redux-immutable';

// Load reducers
import {reducer as formReducer} from 'redux-form/immutable';
import {appReducer} from 'modules/App';
import {authorsReducer, helpDrawerReducer} from 'uqlibrary-react-toolbox';
import {reducer as dashboardReducer} from 'modules/Dashboard';
import {publicationTypeReducer, publicationSubTypeReducer, claimPublicationsReducer} from './modules/Forms';

const rootReducer = combineReducers({
    form: formReducer,
    // App reducers
    app: appReducer,
    authors: authorsReducer,
    claimPublication: claimPublicationsReducer,
    dashboard: dashboardReducer,
    helpDrawer: helpDrawerReducer,
    publicationSubTypes: publicationSubTypeReducer,
    publicationTypes: publicationTypeReducer,
});

export default rootReducer;
