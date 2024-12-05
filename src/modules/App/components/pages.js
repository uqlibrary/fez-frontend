import { lazy } from 'react';

const lazyRetry = (importFn, retries = 3, interval = 500) => {
    return new Promise((resolve, reject) => {
        importFn()
            .then(resolve)
            .catch(error => {
                if (!retries) {
                    reject(error);
                    return;
                }

                setTimeout(() => {
                    lazyRetry(importFn, retries - 1).then(resolve, reject);
                }, interval);
            });
    });
};

// lazy loaded components
export const AddDataCollection = lazy(() =>
    lazyRetry(() => import('modules/AddDataCollection/containers/AddDataCollection')),
);
export const Admin = lazy(() => lazyRetry(() => import('modules/Admin/containers/Admin')));
export const AdminDashboard = lazy(() => lazyRetry(() => import('modules/AdminDashboard/AdminDashboard')));
export const JournalAdmin = lazy(() =>
    lazyRetry(() => import('modules/JournalAdmin/components/JournalAdminContainer')),
);
export const BatchImport = lazy(() => lazyRetry(() => import('modules/BatchImport/components/BatchImport')));
export const BulkUpdates = lazy(() => lazyRetry(() => import('modules/BulkUpdates')));
export const ChangeDisplayType = lazy(() =>
    lazyRetry(() => import('modules/Admin/ChangeDisplayType/containers/ChangeDisplayType')),
);
export const ClaimRecord = lazy(() => lazyRetry(() => import('modules/ClaimRecord/components/ClaimRecord')));
export const CollectionForm = lazy(() =>
    lazyRetry(() => import('modules/Admin/CollectionForm/components/CollectionForm')),
);
export const CommunityForm = lazy(() =>
    lazyRetry(() => import('modules/Admin/CommunityForm/containers/CommunityForm')),
);
export const CommunityList = lazy(() => lazyRetry(() => import('modules/CommunityCollections/CommunityList')));
export const ControlledVocabularies = lazy(() =>
    lazyRetry(() => import('modules/Admin/ControlledVocabularies/ControlledVocabularies')),
);

export const Dashboard = lazy(() => lazyRetry(() => import('modules/Dashboard/containers/Dashboard')));
export const DeleteRecord = lazy(() => lazyRetry(() => import('modules/DeleteRecord/components/DeleteRecord')));
export const Doi = lazy(() => lazyRetry(() => import('modules/Admin/Doi/containers/Doi')));
export const FavouriteSearch = lazy(() =>
    lazyRetry(() => import('modules/Admin/FavouriteSearch/components/FavouriteSearch')),
);
export const FixRecord = lazy(() => lazyRetry(() => import('modules/FixRecord/components/FixRecord')));
export const FeedbackRecord = lazy(() => lazyRetry(() => import('modules/FeedbackRecord/components/FeedbackRecord')));
export const ViewJournal = lazy(() => lazyRetry(() => import('modules/ViewJournal/components/ViewJournal')));
export const ManageAuthors = lazy(() => lazyRetry(() => import('modules/Admin/ManageAuthors')));
export const ManageUsers = lazy(() => lazyRetry(() => import('modules/Admin/ManageUsers')));
export const MasterJournalListIngest = lazy(() =>
    lazyRetry(() => import('modules/Admin/MasterJournalListIngest/components/MasterJournalListIngest')),
);
export const MyEditorialAppointments = lazy(() => lazyRetry(() => import('modules/MyEditorialAppointments')));
export const MyIncompleteRecord = lazy(() =>
    lazyRetry(() => import('modules/MyIncompleteRecords/containers/MyIncompleteRecord')),
);
export const Orcid = lazy(() => lazyRetry(() => import('modules/AuthorIdentifiers/components/Orcid')));
export const PossiblyMyRecords = lazy(() =>
    lazyRetry(() => import('modules/PossiblyMyRecords/containers/PossiblyMyRecords')),
);
export const SbsSubmission = lazy(() => lazyRetry(() => import('modules/SbsSubmission/containers/SbsSubmission')));
export const ThesisSubmission = lazy(() =>
    lazyRetry(() => import('modules/ThesisSubmission/containers/ThesisSubmission')),
);
export const ThirdPartyLookupTool = lazy(() =>
    lazyRetry(() => import('modules/ThirdPartyLookupTool/components/ThirdPartyLookupTool')),
);

// always load components
export { AddMissingRecord, FindRecords, RecordsSearchResults, NewRecord } from 'modules/AddMissingRecord';
export { Index } from 'modules/Index';
export { Masquerade } from 'modules/Masquerade';
export { MyRecords, MyDataCollections, MyIncompleteRecords } from 'modules/MyRecords';
export { ViewRecord } from 'modules/ViewRecord/components/ViewRecord';
export { PageNotFound } from 'modules/NotFound/components/PageNotFound';
export { SearchRecords } from 'modules/SearchRecords';
export { SearchJournals } from 'modules/SearchJournals';
export { FavouriteJournals } from 'modules/FavouriteJournals';
export { JournalComparison } from 'modules/JournalComparison';
export { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
