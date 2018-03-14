import {combineReducers} from 'redux-immutable';

// Load reducers
import {reducer as formReducer} from 'redux-form/immutable';
import {default as helpDrawerReducer} from 'uqlibrary-react-toolbox/build/HelpDrawer/reducer';
import {default as fileUploadReducer} from 'uqlibrary-react-toolbox/build/FileUploader/reducer';

import * as reducers from './reducers';
import * as plugins from './reducers/formReducerPlugins';

const rootReducer = combineReducers({
    form: formReducer.plugin({
        PublicationForm: plugins.resetValue
    }),
    helpDrawer: helpDrawerReducer,
    fileUpload: fileUploadReducer,
    ...reducers
});

export default rootReducer;
