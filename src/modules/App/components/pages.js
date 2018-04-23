import React from 'react';
import Async from 'modules/SharedComponents/Async';

// lazy loaded components
export const FixRecord = () => (<Async load={import('modules/FixRecord/containers/FixRecord')} />);
export const ClaimRecord = () => (<Async load={import('modules/ClaimRecord/containers/ClaimRecord')} />);
export const PossiblyMyRecords = () => (<Async load={import('modules/PossiblyMyRecords/containers/PossiblyMyRecords')} />);
export const MyRecords = () => (<Async load={import('modules/MyRecords/containers/MyRecords')} />);
export const Dashboard = () => (<Async load={import('modules/Dashboard/containers/Dashboard')} />);
export const Orcid = () => (<Async load={import('modules/AuthorIdentifiers/containers/Orcid')} />);
export const GoogleScholar = () => (<Async load={import('modules/AuthorIdentifiers/containers/GoogleScholar')} />);
export const ThesisSubmission = (componentProps) => (<Async load={import('modules/ThesisSubmission/containers/ThesisSubmission')} componentProps={componentProps} />);

// always load components
export {AddMissingRecord, FindRecords, RecordsSearchResults, NewRecord} from 'modules/AddMissingRecord';
export {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
export {Masquerade} from 'modules/Masquerade';
export {ViewRecord} from 'modules/ViewRecord';

