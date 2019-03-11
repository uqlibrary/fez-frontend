import React from 'react';
import Async from 'modules/SharedComponents/Async';

// lazy loaded components
export const FixRecord = () => (<Async load={import('modules/FixRecord/containers/FixRecord')} />);
export const ClaimRecord = () => (<Async load={import('modules/ClaimRecord/containers/ClaimRecord')} />);
export const PossiblyMyRecords = () => (<Async load={import('modules/PossiblyMyRecords/containers/PossiblyMyRecords')} />);
export const Dashboard = () => (<Async load={import('modules/Dashboard/containers/Dashboard')} />);
export const Orcid = () => (<Async load={import('modules/AuthorIdentifiers/containers/Orcid')} />);
export const GoogleScholar = () => (<Async load={import('modules/AuthorIdentifiers/containers/GoogleScholar')} />);
export const ThesisSubmission = (componentProps) => (<Async load={import('modules/ThesisSubmission/containers/ThesisSubmission')} componentProps={componentProps} />);
export const SbsSubmission = (componentProps) => (<Async load={import('modules/SbsSubmission/containers/SbsSubmission')} componentProps={componentProps} />);
export const ViewRecord = () => (<Async load={import('modules/ViewRecord/containers/ViewRecord')} />);
export const AddDataCollection = () => (<Async load={import('modules/AddDataCollection/containers/AddDataCollection')} />);
export const ThirdPartyLookupTool = () => (<Async load={import('modules/ThirdPartyLookupTool/containers/ThirdPartyLookupTool')} />);

// always load components
export {AddMissingRecord, FindRecords, RecordsSearchResults, NewRecord} from 'modules/AddMissingRecord';
export {Index} from 'modules/Index';
export {Admin} from 'modules/Admin';
export {Masquerade} from 'modules/Masquerade';
export {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
export {SearchRecords} from 'modules/SearchRecords';
export {MyRecords, MyDataCollections} from 'modules/MyRecords';
