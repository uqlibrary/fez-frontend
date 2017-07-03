import {combineReducers} from 'redux-immutable';

// Load reducers
import {reducer as formReducer} from 'redux-form/immutable';
import {appReducer} from 'modules/App';
import {helpDrawerReducer} from 'uqlibrary-react-toolbox';
import {reducer as dashboardReducer} from 'modules/Dashboard';
import {addRecordReducer} from 'modules/AddRecord';

import {publicationTypeReducer, publicationSearchReducer, journalArticleReducer, claimPublicationsReducer} from './modules/Forms';
import {authorsReducer, fileUploadReducer} from './modules/SharedComponents';

const rootReducer = combineReducers({
    form: formReducer,
    // App reducers
    addRecord: addRecordReducer,
    app: appReducer,
    authors: authorsReducer,
    fileUpload: fileUploadReducer,
    claimPublication: claimPublicationsReducer,
    dashboard: dashboardReducer,
    helpDrawer: helpDrawerReducer,
    publicationTypes: publicationTypeReducer,
    journalArticle: journalArticleReducer,
    publicationSearch: publicationSearchReducer
});

export default rootReducer;
