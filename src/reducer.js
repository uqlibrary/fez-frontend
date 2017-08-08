import {combineReducers} from 'redux-immutable';

// Load reducers
import {reducer as formReducer} from 'redux-form/immutable';
import {helpDrawerReducer} from 'uqlibrary-react-toolbox';
import {fileUploadReducer, authorLinkingReducer} from './modules/SharedComponents';

import * as reducers from './reducers';


const rootReducer = combineReducers({
    form: formReducer,
    helpDrawer: helpDrawerReducer,

    authorLinking: authorLinkingReducer,
    fileUpload: fileUploadReducer,

    ...reducers
});

export default rootReducer;
