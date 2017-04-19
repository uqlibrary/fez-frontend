import {combineReducers} from 'redux-immutable';
// import {reducer as formReducer} from 'redux-form/immutable';

// Load reducers
import {appReducer} from 'modules/App';
import {reducer as dashboardReducer} from 'modules/Dashboard';
import {publicationTypeReducer, publicationSubTypeReducer} from './modules/Forms';

const rootReducer = combineReducers({
    // App reducers
    app: appReducer,
    dashboard: dashboardReducer,
    publicationTypes: publicationTypeReducer,
    publicationSubTypes: publicationSubTypeReducer
});

export default rootReducer;
