import AddRecordStageContainer from './containers/AddRecordStageContainer';

import {default as SearchRecordStep} from './components/SearchRecord';
import {default as SearchRecordResultsStep} from './components/SearchRecordResults';
import {default as AddNewRecordStep} from './components/AddNewRecord';

export const SearchRecord = AddRecordStageContainer(SearchRecordStep);
export const SearchRecordResults = AddRecordStageContainer(SearchRecordResultsStep);
export const AddNewRecord = AddRecordStageContainer(AddNewRecordStep);
