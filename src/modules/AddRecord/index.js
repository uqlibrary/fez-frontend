export {default as AddRecord} from './containers/AddRecord';
export {default as PublicationSearchResults} from './components/PublicationSearchResults';
export {default as AddNewPublication} from './components/AddNewPublication';

import AddRecordStageContainer from './containers/AddRecordStageContainer';
import {default as PublicationSearchRecordStep} from './components/PublicationSearchRecord';

export const PublicationSearchRecord = AddRecordStageContainer(PublicationSearchRecordStep);
