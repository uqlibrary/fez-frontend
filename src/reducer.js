import {combineReducers} from 'redux-immutable';

// Load reducers
import {reducer as formReducer} from 'redux-form/immutable';
import {helpDrawerReducer, fileUploadReducer} from 'uqlibrary-react-toolbox';

import * as reducers from './reducers';

const rootReducer = combineReducers({
    form: formReducer,
    helpDrawer: helpDrawerReducer,
    fileUpload: fileUploadReducer,
    ...reducers
});

export default rootReducer;
