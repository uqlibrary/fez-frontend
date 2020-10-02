import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router/immutable';
import { history } from 'config/history';

// Load reducers
import { reducer as formReducer } from 'redux-form/immutable';
import { default as helpDrawerReducer } from 'modules/SharedComponents/Toolbox/HelpDrawer/reducer';
import { default as fileUploadReducer } from 'modules/SharedComponents/Toolbox/FileUploader/reducer';

import * as reducers from './reducers';
import * as plugins from './reducers/formReducerPlugins';

const rootReducer = combineReducers({
    form: formReducer.plugin({
        PublicationForm: plugins.resetValue,
        AdminWorkForm: plugins.deleteFileFromSecuritySection,
        ChangeSearchKeyValueForm: plugins.resetValue,
    }),
    helpDrawer: helpDrawerReducer,
    fileUpload: fileUploadReducer,
    router: connectRouter(history),
    ...reducers,
});

export default rootReducer;
