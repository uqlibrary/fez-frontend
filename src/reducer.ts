import { combineReducers } from 'redux-immutable';

// Load reducers
import { reducer as formReducer } from 'redux-form/immutable';
import { default as helpDrawerReducer } from 'modules/SharedComponents/Toolbox/HelpDrawer/reducer';
import { default as fileUploadReducer } from 'modules/SharedComponents/Toolbox/FileUploader/reducer';

import * as reducers from './reducers';
import * as plugins from './reducers/formReducerPlugins';

const rootReducer = () =>
    combineReducers({
        form: formReducer.plugin({
            PublicationForm: plugins.resetValue,
            AdminWorkForm: plugins.adminReduxFormPlugin,
            ChangeSearchKeyValueForm: plugins.resetValue,
            ChangeAuthorIdForm: plugins.resetValue,
        }),
        helpDrawer: helpDrawerReducer,
        fileUpload: fileUploadReducer,
        ...reducers,
    });

export default rootReducer;

// @ts-ignore
export type AppState = Map<string, any>;
