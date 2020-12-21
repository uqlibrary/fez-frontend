import React from 'react';

// lazy loaded components
export const AddDataCollection = React.lazy(() => import('modules/AddDataCollection/containers/AddDataCollection'));
export const Admin = React.lazy(() => import('modules/Admin/containers/Admin'));
export const BatchImport = React.lazy(() => import('modules/BatchImport/components/BatchImport'));
export const BulkUpdates = React.lazy(() => import('modules/BulkUpdates'));
export const ChangeDisplayType = React.lazy(() =>
    import('modules/Admin/ChangeDisplayType/containers/ChangeDisplayType'),
);
export const ClaimRecord = React.lazy(() => import('modules/ClaimRecord/containers/ClaimRecord'));
export const CollectionForm = React.lazy(() => import('modules/Admin/CollectionForm/containers/CollectionForm'));
export const CommunityForm = React.lazy(() => import('modules/Admin/CommunityForm/containers/CommunityForm'));
export const Dashboard = React.lazy(() => import('modules/Dashboard/containers/Dashboard'));
export const DeleteRecord = React.lazy(() => import('modules/DeleteRecord/containers/DeleteRecord'));
export const Doi = React.lazy(() => import('modules/Admin/Doi/containers/Doi'));
export const FavouriteSearch = React.lazy(() => import('modules/Admin/FavouriteSearch/components/FavouriteSearch'));
export const FixRecord = React.lazy(() => import('modules/FixRecord/containers/FixRecord'));
export const GoogleScholar = React.lazy(() => import('modules/AuthorIdentifiers/containers/GoogleScholar'));
export const MyIncompleteRecord = React.lazy(() => import('modules/MyIncompleteRecords/containers/MyIncompleteRecord'));
export const NewViewRecord = React.lazy(() => import('modules/ViewRecord/containers/NewViewRecord'));
export const NotFound = React.lazy(() => import('modules/NotFound/components/NotFound'));
export const Orcid = React.lazy(() => import('modules/AuthorIdentifiers/containers/Orcid'));
export const PossiblyMyRecords = React.lazy(() => import('modules/PossiblyMyRecords/containers/PossiblyMyRecords'));
export const SbsSubmission = React.lazy(() => import('modules/SbsSubmission/containers/SbsSubmission'));
export const ThesisSubmission = React.lazy(() => import('modules/ThesisSubmission/containers/ThesisSubmission'));
export const ThirdPartyLookupTool = React.lazy(() =>
    import('modules/ThirdPartyLookupTool/containers/ThirdPartyLookupTool'),
);

// always load components
export { AddMissingRecord, FindRecords, RecordsSearchResults, NewRecord } from 'modules/AddMissingRecord';
export { Index } from 'modules/Index';
export { Masquerade } from 'modules/Masquerade';
export { MyRecords, MyDataCollections, MyIncompleteRecords } from 'modules/MyRecords';
export { SearchRecords } from 'modules/SearchRecords';
export { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
