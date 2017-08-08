import {combineReducers} from 'redux-immutable';

// Load reducers
import {reducer as formReducer} from 'redux-form/immutable';
import {helpDrawerReducer} from 'uqlibrary-react-toolbox';

import {addRecordReducer} from './modules/AddRecord';

import {fileUploadReducer, authorLinkingReducer} from './modules/SharedComponents';

import * as reducers from './reducers';


const rootReducer = combineReducers({
    form: formReducer,

    authorLinking: authorLinkingReducer,
    fileUpload: fileUploadReducer,
    helpDrawer: helpDrawerReducer,

    // migrated reducers
    addRecordReducer,
    ...reducers
});

export default rootReducer;
