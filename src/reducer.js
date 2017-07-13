import {combineReducers} from 'redux-immutable';

// Load reducers
import {reducer as formReducer} from 'redux-form/immutable';
import {appReducer} from 'modules/App';
import {helpDrawerReducer} from 'uqlibrary-react-toolbox';
import {reducer as dashboardReducer} from 'modules/Dashboard';
import {addRecordReducer} from 'modules/AddRecord';
import {claimPublicationsReducer} from 'modules/ClaimPublication';

import {publicationTypeReducer, publicationSearchReducer, journalArticleReducer} from './modules/Forms';
import {fileUploadReducer, authorLinkingReducer} from './modules/SharedComponents';

import authorsReducer from 'reducers/authors';

const rootReducer = combineReducers({
    form: formReducer,
    // App reducers
    addRecord: addRecordReducer,
    app: appReducer,
    authorLinking: authorLinkingReducer,
    fileUpload: fileUploadReducer,
    claimPublication: claimPublicationsReducer,
    dashboard: dashboardReducer,
    helpDrawer: helpDrawerReducer,
    publicationTypes: publicationTypeReducer,
    journalArticle: journalArticleReducer,
    publicationSearch: publicationSearchReducer,
    // migrated reducers
    authorsReducer
});

export default rootReducer;
