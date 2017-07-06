import {combineReducers} from 'redux-immutable';

// Load reducers
import {reducer as formReducer} from 'redux-form/immutable';
import {appReducer} from 'modules/App';
import {helpDrawerReducer} from 'uqlibrary-react-toolbox';
import {reducer as dashboardReducer} from 'modules/Dashboard';
import {addRecordReducer} from 'modules/AddRecord';
import {claimPublicationsReducer} from 'modules/ClaimPublication';

import {publicationTypeReducer, publicationSearchReducer, journalArticleReducer} from './modules/Forms';
import {authorsReducer, fileUploadReducer, authorLinkingReducer} from './modules/SharedComponents';

const rootReducer = combineReducers({
    form: formReducer,
    // App reducers
    addRecord: addRecordReducer,
    app: appReducer,
    authors: authorsReducer,
    authorLinking: authorLinkingReducer,
    fileUpload: fileUploadReducer,
    claimPublication: claimPublicationsReducer,
    dashboard: dashboardReducer,
    helpDrawer: helpDrawerReducer,
    publicationTypes: publicationTypeReducer,
    journalArticle: journalArticleReducer,
    publicationSearch: publicationSearchReducer
});

export default rootReducer;
