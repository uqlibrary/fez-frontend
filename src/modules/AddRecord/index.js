export {default as AddRecord} from './containers/AddRecord';

import AddRecordStageContainer from './containers/AddRecordStageContainer';

import {default as PublicationSearchRecordStep} from './components/PublicationSearchRecord';
import {default as PublicationSearchResultsStep} from './components/PublicationSearchResults';
import {default as AddNewPublicationStep} from './components/AddNewPublication';

export const PublicationSearchRecord = AddRecordStageContainer(PublicationSearchRecordStep);
export const PublicationSearchResults = AddRecordStageContainer(PublicationSearchResultsStep);
export const AddNewPublication = AddRecordStageContainer(AddNewPublicationStep);
