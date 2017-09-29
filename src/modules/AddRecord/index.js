export {default as AddRecord} from './containers/AddRecord';

import AddRecordStageContainer from './containers/AddRecordStageContainer';

import {default as SearchPublicationStep} from './components/SearchPublication';
import {default as SearchPublicationResultsStep} from './components/SearchPublicationResults';
import {default as AddNewPublicationStep} from './components/AddNewPublication';

export const SearchPublication = AddRecordStageContainer(SearchPublicationStep);
export const SearchPublicationResults = AddRecordStageContainer(SearchPublicationResultsStep);
export const AddNewPublication = AddRecordStageContainer(AddNewPublicationStep);
