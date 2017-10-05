import AddRecordStageContainer from './containers/AddRecordStageContainer';
import {default as AddRecord} from './components/AddRecord';

export const AddRecordPage = AddRecordStageContainer(AddRecord);

export {default as SearchRecord} from './components/SearchRecord';
export {default as SearchRecordResults} from './components/SearchRecordResults';
export {default as AddNewRecord} from './components/AddNewRecord';

