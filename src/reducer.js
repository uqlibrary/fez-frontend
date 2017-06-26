import {combineReducers} from 'redux-immutable';

// Load reducers
import {reducer as formReducer} from 'redux-form/immutable';
import {appReducer} from 'modules/App';
import {helpDrawerReducer} from 'uqlibrary-react-toolbox';
import {reducer as dashboardReducer} from 'modules/Dashboard';
import {addRecordReducer} from 'modules/AddRecord';
import {publicationTypeReducer, publicationSearchReducer, publicationSubTypeReducer} from './modules/Forms';

const rootReducer = combineReducers({
    form: formReducer,
    // App reducers
    addRecord: addRecordReducer,
    app: appReducer,
    dashboard: dashboardReducer,
    helpDrawer: helpDrawerReducer,
    publicationTypes: publicationTypeReducer,
    publicationSubTypes: publicationSubTypeReducer,
    publicationSearch: publicationSearchReducer,
});

export default rootReducer;
