import { combineReducers } from 'redux-immutable';

// Load reducers
import { default as helpDrawerReducer } from 'modules/SharedComponents/Toolbox/HelpDrawer/reducer';
import { default as fileUploadReducer } from 'modules/SharedComponents/Toolbox/FileUploader/reducer';

import * as reducers from './reducers';

const rootReducer = () =>
    combineReducers({
        form: (state = Map) => state,
        helpDrawer: helpDrawerReducer,
        fileUpload: fileUploadReducer,
        ...reducers,
    });

export default rootReducer;

// @ts-ignore
export type AppState = Map<string, any>;
