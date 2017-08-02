import {combineReducers} from 'redux-immutable';

// Load reducers
import {reducer as formReducer} from 'redux-form/immutable';
import {appReducer} from 'modules/App';
import {helpDrawerReducer} from 'uqlibrary-react-toolbox';

import {addRecordReducer} from './modules/AddRecord';

import {fileUploadReducer, authorLinkingReducer} from './modules/SharedComponents';

import authorsReducer from 'reducers/authors';
import authorDetailsReducer from 'reducers/authorDetails';
import currentAuthorReducer from 'reducers/currentAuthor';
import claimPublicationReducer from 'reducers/claimPublication';

const rootReducer = combineReducers({
    form: formReducer,
    // App reducers
    app: appReducer,
    authorLinking: authorLinkingReducer,
    fileUpload: fileUploadReducer,
    helpDrawer: helpDrawerReducer,

    // migrated reducers
    addRecordReducer,
    claimPublicationReducer,
    currentAuthorReducer,
    authorDetailsReducer,
    authorsReducer
});

export default rootReducer;
