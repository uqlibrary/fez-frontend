import {combineReducers} from 'redux-immutable';

// Load reducers
import {appReducer} from 'modules/App';
import {reducer as dashboardReducer} from 'modules/Dashboard';
import {helpDrawerReducer} from 'uqlibrary-react-toolbox';

import {publicationSearchReducer} from 'modules/Forms';

const rootReducer = combineReducers({
    // App reducers
    app: appReducer,
    dashboard: dashboardReducer,
    helpDrawer: helpDrawerReducer,
    publicationSearch: publicationSearchReducer,
});

export default rootReducer;
