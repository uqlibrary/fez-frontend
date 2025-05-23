export const getActionSuffix = action => action.substring(action.indexOf('@') + 1, action.length);
export const getAction = action => action.substring(0, action.indexOf('@') + 1);

// Scale of Significance
export const ADMIN_AUTHORS_UPDATED = 'ADMIN_AUTHORS_UPDATED';
export const ADMIN_SCALE_SIGNIFICANCE_UPDATED = 'ADMIN_SCALE_SIGNIFICANCE_UPDATED';
export const ADMIN_SCALE_SIGNIFICANCE_CLEARED = 'ADMIN_SCALE_SIGNIFICANCE_CLEARED';
export const ADMIN_SCALE_SIGNIFICANCE_RESET = 'ADMIN_SCALE_SIGNIFICANCE_RESET';
// Academic stats
export const AUTHOR_PUBLICATIONS_STATS_LOADING = 'AUTHOR_PUBLICATIONS_STATS_LOADING';
export const AUTHOR_PUBLICATIONS_STATS_LOADED = 'AUTHOR_PUBLICATIONS_STATS_LOADED';
export const AUTHOR_PUBLICATIONS_COUNT_PER_TYPE_LOADED = 'AUTHOR_PUBLICATIONS_COUNT_PER_TYPE_LOADED';
export const AUTHOR_PUBLICATIONS_BY_YEAR_LOADED = 'AUTHOR_PUBLICATIONS_BY_YEAR_LOADED';
export const AUTHOR_PUBLICATIONS_STATS_FAILED = 'AUTHOR_PUBLICATIONS_STATS_FAILED';
export const AUTHOR_PUBLICATIONS_COUNT_TOTAL_LOADED = 'AUTHOR_PUBLICATIONS_COUNT_TOTAL_LOADED';

// Claim publication actions
export const POSSIBLY_YOUR_PUBLICATIONS_LOADING = 'POSSIBLY_YOUR_PUBLICATIONS_LOADING';
export const POSSIBLY_YOUR_PUBLICATIONS_LOADED = 'POSSIBLY_YOUR_PUBLICATIONS_LOADED';
export const POSSIBLY_YOUR_PUBLICATIONS_FACETS_LOADED = 'POSSIBLY_YOUR_PUBLICATIONS_FACETS_LOADED';
export const POSSIBLY_YOUR_PUBLICATIONS_FAILED = 'POSSIBLY_YOUR_PUBLICATIONS_FAILED';

export const COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING = 'COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING';
export const COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADED = 'COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADED';
export const COUNT_POSSIBLY_YOUR_PUBLICATIONS_FAILED = 'COUNT_POSSIBLY_YOUR_PUBLICATIONS_FAILED';

export const HIDE_PUBLICATIONS_LOADING = 'HIDE_PUBLICATIONS_LOADING';
export const HIDE_PUBLICATIONS_LOADED = 'HIDE_PUBLICATIONS_LOADED';
export const HIDE_PUBLICATIONS_FAILED = 'HIDE_PUBLICATIONS_FAILED';
export const HIDE_PUBLICATIONS_FAILED_RESET = 'HIDE_PUBLICATIONS_FAILED_RESET';

export const PUBLICATION_TO_CLAIM_SET = 'PUBLICATION_TO_CLAIM_SET';
export const PUBLICATION_TO_CLAIM_CLEAR = 'PUBLICATION_TO_CLAIM_CLEAR';

export const PUBLICATION_TO_CLAIM_LOADING = 'PUBLICATION_TO_CLAIM_LOADING';
export const PUBLICATION_TO_CLAIM_LOADED = 'PUBLICATION_TO_CLAIM_LOADED';
export const PUBLICATION_TO_CLAIM_FAILED = 'PUBLICATION_TO_CLAIM_FAILED';

export const CLAIM_PUBLICATION_CREATE_PROCESSING = 'CLAIM_PUBLICATION_CREATE_PROCESSING';
export const CLAIM_PUBLICATION_CREATE_COMPLETED = 'CLAIM_PUBLICATION_CREATE_COMPLETED';
export const CLAIM_PUBLICATION_CREATE_FAILED = 'CLAIM_PUBLICATION_CREATE_FAILED';

// Search
/**
 * Action types
 * for specific source actions will create source@SEARCH_ACTION, eg SEARCH_LOADING@wos etc
 */
export const SEARCH_LOADING = 'SEARCH_LOADING';
export const SEARCH_LOADED = 'SEARCH_LOADED';
export const SEARCH_FAILED = 'SEARCH_FAILED';
export const SEARCH_SOURCE_COUNT = 'SEARCH_SOURCE_COUNT';
export const SET_SEARCH_QUERY = 'SET_SEARCH_QUERY';
export const CLEAR_SEARCH_QUERY = 'CLEAR_SEARCH_QUERY';

export const EXPORT_PUBLICATIONS_LOADING = 'EXPORT_PUBLICATIONS_LOADING';
export const EXPORT_PUBLICATIONS_LOADED = 'EXPORT_PUBLICATIONS_LOADED';
export const EXPORT_PUBLICATIONS_FAILED = 'EXPORT_PUBLICATIONS_FAILED';
export const EXPORT_PUBLICATIONS_RESET = 'EXPORT_PUBLICATIONS_RESET';

export const EXPORT_COMMUNITIES_LOADING = 'EXPORT_COMMUNITIES_LOADING';
export const EXPORT_COMMUNITIES_LOADED = 'EXPORT_COMMUNITIES_LOADED';
export const EXPORT_COMMUNITIES_FAILED = 'EXPORT_COMMUNITIES_FAILED';
export const EXPORT_COMMUNITIES_RESET = 'EXPORT_COMMUNITIES_RESET';
export const EXPORT_COLLECTIONS_LOADING = 'EXPORT_COLLECTIONS_LOADING';
export const EXPORT_COLLECTIONS_LOADED = 'EXPORT_COLLECTIONS_LOADED';
export const EXPORT_COLLECTIONS_FAILED = 'EXPORT_COLLECTIONS_FAILED';
export const EXPORT_COLLECTIONS_RESET = 'EXPORT_COLLECTIONS_RESET';

// authors publications
export const LATEST_PUBLICATIONS_LOADING = 'LATEST_PUBLICATIONS_LOADING';
export const LATEST_PUBLICATIONS_LOADED = 'LATEST_PUBLICATIONS_LOADED';
export const LATEST_PUBLICATIONS_FAILED = 'LATEST_PUBLICATIONS_FAILED';

export const AUTHOR_PUBLICATIONS_LOADING = 'AUTHOR_PUBLICATIONS_LOADING';
export const AUTHOR_PUBLICATIONS_LOADED = 'AUTHOR_PUBLICATIONS_LOADED';
export const AUTHOR_PUBLICATIONS_FAILED = 'AUTHOR_PUBLICATIONS_FAILED';

export const TRENDING_PUBLICATIONS_LOADING = 'TRENDING_PUBLICATIONS_LOADING';
export const TRENDING_PUBLICATIONS_LOADED = 'TRENDING_PUBLICATIONS_LOADED';
export const TRENDING_PUBLICATIONS_FAILED = 'TRENDING_PUBLICATIONS_FAILED';

export const TOP_CITED_PUBLICATIONS_LOADING = 'TOP_CITED_PUBLICATIONS_LOADING';
export const TOP_CITED_PUBLICATIONS_LOADED = 'TOP_CITED_PUBLICATIONS_LOADED';
export const TOP_CITED_PUBLICATIONS_FAILED = 'TOP_CITED_PUBLICATIONS_FAILED';

// Accounts/authors
export const CURRENT_ACCOUNT_LOADING = 'CURRENT_ACCOUNT_LOADING';
export const CURRENT_ACCOUNT_LOADED = 'CURRENT_ACCOUNT_LOADED';
export const CURRENT_ACCOUNT_ANONYMOUS = 'CURRENT_ACCOUNT_ANONYMOUS';
export const CURRENT_ACCOUNT_SESSION_EXPIRED = 'CURRENT_ACCOUNT_SESSION_EXPIRED';
export const CURRENT_ACCOUNT_SESSION_VALID = 'CURRENT_ACCOUNT_SESSION_VALID';
export const CLEAR_CURRENT_ACCOUNT_SESSION_FLAG = 'CLEAR_CURRENT_ACCOUNT_SESSION_FLAG';

export const CURRENT_AUTHOR_LOADING = 'CURRENT_AUTHOR_LOADING';
export const CURRENT_AUTHOR_LOADED = 'CURRENT_AUTHOR_LOADED';
export const CURRENT_AUTHOR_FAILED = 'CURRENT_AUTHOR_FAILED';
export const CURRENT_AUTHOR_SAVING = 'CURRENT_AUTHOR_SAVING';
export const CURRENT_AUTHOR_SAVED = 'CURRENT_AUTHOR_SAVED';
export const CURRENT_AUTHOR_SAVE_FAILED = 'CURRENT_AUTHOR_SAVE_FAILED';
export const CURRENT_AUTHOR_SAVE_RESET = 'CURRENT_AUTHOR_SAVE_RESET';

export const CURRENT_AUTHOR_DETAILS_LOADING = 'CURRENT_AUTHOR_DETAILS_LOADING';
export const CURRENT_AUTHOR_DETAILS_LOADED = 'CURRENT_AUTHOR_DETAILS_LOADED';
export const CURRENT_AUTHOR_DETAILS_FAILED = 'CURRENT_AUTHOR_DETAILS_FAILED';

export const AUTHORS_LOADING = 'AUTHORS_LOADING';
export const AUTHORS_LOADED = 'AUTHORS_LOADED';
export const AUTHORS_LOAD_FAILED = 'AUTHORS_LOAD_FAILED';
export const CLEAR_AUTHORS_LIST = 'CLEAR_AUTHORS_LIST';

// Records
export const CREATE_RECORD_RESET = 'CREATE_RECORD_RESET';
export const CREATE_RECORD_SAVING = 'CREATE_RECORD_SAVING';
export const CREATE_RECORD_SUCCESS = 'CREATE_RECORD_SUCCESS';
export const CREATE_RECORD_FAILED = 'CREATE_RECORD_FAILED';

export const ADMIN_CREATE_RECORD_RESET = 'ADMIN_CREATE_RECORD_RESET';
export const ADMIN_CREATE_RECORD_SAVING = 'ADMIN_CREATE_RECORD_SAVING';
export const ADMIN_CREATE_RECORD_SUCCESS = 'ADMIN_CREATE_RECORD_SUCCESS';
export const ADMIN_CREATE_RECORD_FAILED = 'ADMIN_CREATE_RECORD_FAILED';
export const ADMIN_DELETE_ATTACHED_FILE = 'ADMIN_DELETE_ATTACHED_FILE';
export const ADMIN_RENAME_ATTACHED_FILE = 'ADMIN_RENAME_ATTACHED_FILE';
export const ADMIN_UPDATE_WORK_JOB_CREATED = 'ADMIN_UPDATE_WORK_JOB_CREATED';

export const SEARCH_COLLECTION_LOADING = 'SEARCH_COLLECTION_LOADING';
export const SEARCH_COLLECTION_LOADED = 'SEARCH_COLLECTION_LOADED';
export const SEARCH_COLLECTION_FAILED = 'SEARCH_COLLECTION_FAILED';

export const CREATE_COLLECTION_SAVING = 'CREATE_COLLECTION_SAVING';
export const CREATE_COLLECTION_FAILED = 'CREATE_COLLECTION_FAILED';
export const CREATE_COLLECTION_SUCCESS = 'CREATE_COLLECTION_SUCCESS';

export const SEARCH_COMMUNITIES_LOADING = 'SEARCH_COMMUNITIES_LOADING';
export const SEARCH_COMMUNITIES_LOADED = 'SEARCH_COMMUNITIES_LOADED';
export const SEARCH_COMMUNITIES_FAILED = 'SEARCH_COMMUNITIES_FAILED';

export const CREATE_COMMUNITY_SAVING = 'CREATE_COMMUNITY_SAVING';
export const CREATE_COMMUNITY_FAILED = 'CREATE_COMMUNITY_FAILED';
export const CREATE_COMMUNITY_SUCCESS = 'CREATE_COMMUNITY_SUCCESS';

// Files
export const FILE_UPLOAD_CLEARED = 'FILE_UPLOAD_CLEARED';
export const FILE_UPLOAD_COMPLETE = 'FILE_UPLOAD_COMPLETE';
export const FILE_UPLOAD_FAILED = 'FILE_UPLOAD_FAILED';
export const FILE_UPLOAD_PROGRESS = 'FILE_UPLOAD_PROGRESS';
export const FILE_UPLOAD_STARTED = 'FILE_UPLOAD_STARTED';

// View records
export const VIEW_RECORD_CLEAR = 'VIEW_RECORD_CLEAR';

export const VIEW_RECORD_LOADING = 'VIEW_RECORD_LOADING';
export const VIEW_RECORD_LOADED = 'VIEW_RECORD_LOADED';
export const VIEW_RECORD_VERSION_DELETED_LOADED = 'VIEW_RECORD_VERSION_DELETED_LOADED';
export const VIEW_RECORD_LOAD_FAILED = 'VIEW_RECORD_LOAD_FAILED';
export const VIEW_RECORD_UNLOCK = 'VIEW_RECORD_UNLOCK';
export const VIEW_RECORD_DELETED_LOADED = 'VIEW_RECORD_DELETED_LOADED';

// Fix records
export const FIX_RECORD_SET = 'FIX_RECORD_SET';
export const FIX_RECORD_CLEAR = 'FIX_RECORD_CLEAR';

export const FIX_RECORD_LOADING = 'FIX_RECORD_LOADING';
export const FIX_RECORD_LOADED = 'FIX_RECORD_LOADED';
export const FIX_RECORD_LOAD_FAILED = 'FIX_RECORD_LOAD_FAILED';

export const FIX_RECORD_PROCESSING = 'FIX_RECORD_PROCESSING';
export const FIX_RECORD_SUCCESS = 'FIX_RECORD_SUCCESS';
export const FIX_RECORD_UNCLAIM_SUCCESS = 'FIX_RECORD_UNCLAIM_SUCCESS';
export const FIX_RECORD_FAILED = 'FIX_RECORD_FAILED';

// Feedback records
export const FEEDBACK_RECORD_CLEAR = 'FEEDBACK_RECORD_CLEAR';
export const FEEDBACK_RECORD_LOADING = 'FEEDBACK_RECORD_LOADING';
export const FEEDBACK_RECORD_LOADED = 'FEEDBACK_RECORD_LOADED';
export const FEEDBACK_RECORD_LOAD_FAILED = 'FEEDBACK_RECORD_LOAD_FAILED';
export const FEEDBACK_RECORD_PROCESSING = 'FEEDBACK_RECORD_PROCESSING';
export const FEEDBACK_RECORD_SUCCESS = 'FEEDBACK_RECORD_SUCCESS';
export const FEEDBACK_RECORD_FAILED = 'FEEDBACK_RECORD_FAILED';

// Delete records
export const DELETE_RECORD_SET = 'DELETE_RECORD_SET';
export const DELETE_RECORD_CLEAR = 'DELETE_RECORD_CLEAR';

export const DELETE_RECORD_LOADING = 'DELETE_RECORD_LOADING';
export const DELETE_RECORD_LOADED = 'DELETE_RECORD_LOADED';
export const DELETE_RECORD_LOAD_FAILED = 'DELETE_RECORD_LOAD_FAILED';

export const DELETE_RECORD_PROCESSING = 'DELETE_RECORD_PROCESSING';
export const DELETE_RECORD_SUCCESS = 'DELETE_RECORD_SUCCESS';
export const DELETE_RECORD_FAILED = 'DELETE_RECORD_FAILED';

export const UPDATE_DELETED_RECORD_PROCESSING = 'UPDATE_DELETED_RECORD_PROCESSING';
export const UPDATE_DELETED_RECORD_SUCCESS = 'UPDATE_DELETED_RECORD_SUCCESS';
export const UPDATE_DELETED_RECORD_FAILED = 'UPDATE_DELETED_RECORD_FAILED';

// Update DOI
export const RECORD_DOI_UPDATE_REQUESTING = 'RECORD_DOI_UPDATE_REQUESTING';
export const RECORD_DOI_UPDATE_SUCCEEDED = 'RECORD_DOI_UPDATE_SUCCEEDED';
export const RECORD_DOI_UPDATE_FAILED = 'RECORD_DOI_UPDATE_FAILED';
export const RECORD_DOI_RESET = 'RECORD_DOI_RESET';

// Search keys
export const SEARCH_KEY_LOOKUP_LOADING = 'SEARCH_KEY_LOOKUP_LOADING';
export const SEARCH_KEY_LOOKUP_LOADED = 'SEARCH_KEY_LOOKUP_LOADED';
export const SEARCH_KEY_LOOKUP_FAILED = 'SEARCH_KEY_LOOKUP_FAILED';

// Controlled vocabularies
export const VOCABULARIES_LOADING = 'VOCABULARIES_LOADING';
export const VOCABULARIES_LOADED = 'VOCABULARIES_LOADED';
export const VOCABULARIES_LOAD_FAILED = 'VOCABULARIES_LOAD_FAILED';

// Controlled vocabularies new
export const VIEW_VOCAB_LOADING = 'VIEW_VOCAB_LOADING';
export const VIEW_VOCAB_LOADED = 'VIEW_VOCAB_LOADED';
export const VIEW_VOCAB_LOAD_FAILED = 'VIEW_VOCAB_LOAD_FAILED';

export const VIEW_CHILD_VOCAB_LOADING = 'VIEW_CHILD_VOCAB_LOADING';
export const VIEW_CHILD_VOCAB_LOADED = 'VIEW_CHILD_VOCAB_LOADED';
export const VIEW_CHILD_VOCAB_LOAD_FAILED = 'VIEW_CHILD_VOCAB_LOAD_FAILED';

export const VOCAB_ADMIN_BUSY = 'VOCAB_ADMIN_BUSY';
export const VOCAB_ADMIN_SUCCESS = 'VOCAB_ADMIN_SUCCESS';
export const VOCAB_ADMIN_FAILED = 'VOCAB_ADMIN_FAILED';
export const VOCAB_ADMIN_CLEAR = 'VOCAB_ADMIN_CLEAR';
export const VOCAB_ADMIN_ACTION = 'VOCAB_ADMIN_ACTION';

export const VIEW_CHILD_VOCAB_CLEARED = 'VIEW_CHILD_VOCAB_CLEARED';
export const SET_CHILD_VOCAB_ARRAY = 'SET_CHILD_VOCAB_ARRAY';

export const VOCAB_SET_PER_PAGE = 'VOCAB_SET_PER_PAGE';
export const VOCAB_SET_CURRENT_PAGE = 'VOCAB_SET_CURRENT_PAGE';

// Dashboard lure
export const APP_DASHBOARD_POSSIBLY_YOUR_PUBLICATIONS_LURE_HIDE = 'APP_DASHBOARD_POSSIBLY_YOUR_PUBLICATIONS_LURE_HIDE';
export const APP_ALERT_SHOW = 'APP_ALERT_SHOW';
export const APP_ALERT_HIDE = 'APP_ALERT_HIDE';
export const SET_REDIRECT_PATH = 'SET_REDIRECT_PATH';
export const CLEAR_REDIRECT_PATH = 'CLEAR_REDIRECT_PATH';

// Lookup Tools
export const THIRD_PARTY_LOOKUP_TOOL_CLEAR = 'THIRD_PARTY_LOOKUP_TOOL_CLEAR';
export const THIRD_PARTY_LOOKUP_TOOL_LOADING = 'THIRD_PARTY_LOOKUP_TOOL_LOADING';
export const THIRD_PARTY_LOOKUP_TOOL_SUCCESS = 'THIRD_PARTY_LOOKUP_TOOL_SUCCESS';
export const THIRD_PARTY_LOOKUP_TOOL_LOAD_FAILED = 'THIRD_PARTY_LOOKUP_TOOL_LOAD_FAILED';

// List of all actions loading publications - for middleware
export const loadPublicationsListActions = new RegExp(`^(\
${LATEST_PUBLICATIONS_LOADED}|\
${AUTHOR_PUBLICATIONS_LOADED}(@\\w+)|\
${SEARCH_LOADED}(|@\\w+)|\
${POSSIBLY_YOUR_PUBLICATIONS_LOADED}|\
${TRENDING_PUBLICATIONS_LOADED}(@\\w+)|\
${TOP_CITED_PUBLICATIONS_LOADED}(@\\w+)\
)$`);
export const loadPublicationActions = new RegExp(
    `^(${FIX_RECORD_LOADED}|${VIEW_RECORD_LOADED}|${VIEW_RECORD_DELETED_LOADED}|${DELETE_RECORD_LOADED})$`,
);

// digiteam batch import - fetch list of directories for importing
export const DIRECTORY_LIST_LOADING = 'DIRECTORY_LIST_LOADING';
export const DIRECTORY_LIST_LOADED = 'DIRECTORY_LIST_LOADED';
export const DIRECTORY_LIST_FAILED = 'DIRECTORY_LIST_FAILED';

// digiteam batch import - submit import request
export const BATCH_IMPORT_REQUESTING = 'BATCH_IMPORT_REQUESTING';
export const BATCH_IMPORT_REQUESTED = 'BATCH_IMPORT_REQUESTED';
export const BATCH_IMPORT_REQUEST_FAILED = 'BATCH_IMPORT_REQUEST_FAILED';

// bulk update - view/update action types
export const BULK_UPDATES_LIST_LOADING = 'BULK_UPDATES_LIST_LOADING';
export const BULK_UPDATES_LIST_LOADED = 'BULK_UPDATES_LIST_LOADED';
export const BULK_UPDATES_LIST_FAILED = 'BULK_UPDATES_LIST_FAILED';

// export const BULK_UPDATES_LIST_UPDATING = 'BULK_UPDATES_LIST_UPDATING';
// export const BULK_UPDATES_LIST_UPDATE_SUCCESS = 'BULK_UPDATES_LIST_UPDATE_SUCCESS';
// export const BULK_UPDATES_LIST_UPDATE_FAILED = 'BULK_UPDATES_LIST_UPDATE_FAILED';

// export const BULK_UPDATES_ITEM_LOADING = 'BULK_UPDATES_ITEM_LOADING';
// export const BULK_UPDATES_ITEM_LOADED = 'BULK_UPDATES_ITEM_LOADED';
// export const BULK_UPDATES_ITEM_FAILED = 'BULK_UPDATES_ITEM_FAILED';

// export const BULK_UPDATES_ITEM_UPDATING = 'BULK_UPDATES_ITEM_UPDATING';
// export const BULK_UPDATES_ITEM_UPDATE_SUCCESS = 'BULK_UPDATES_ITEM_UPDATE_SUCCESS';
// export const BULK_UPDATES_ITEM_UPDATE_FAILED = 'BULK_UPDATES_ITEM_UPDATE_FAILED';

// Security
export const SECURITY_POLICY_LOADING = 'SECURITY_POLICY_LOADING';
export const SECURITY_POLICY_LOADED = 'SECURITY_POLICY_LOADED';
export const SECURITY_POLICY_LOAD_FAILED = 'SECURITY_POLICY_LOAD_FAILED';

export const SECURITY_POLICY_SAVING = 'SECURITY_POLICY_SAVING';
export const SECURITY_POLICY_SAVED = 'SECURITY_POLICY_SAVED';
export const SECURITY_POLICY_SAVE_FAILED = 'SECURITY_POLICY_SAVE_FAILED';

// Admin edit
export const ADMIN_UPDATE_WORK_PROCESSING = 'ADMIN_UPDATE_WORK_PROCESSING';
export const ADMIN_UPDATE_WORK_SUCCESS = 'ADMIN_UPDATE_WORK_SUCCESS';
export const ADMIN_UPDATE_WORK_FAILED = 'ADMIN_UPDATE_WORK_FAILED';

export const COLLECTION_UPDATING = 'COLLECTION_UPDATING';
export const COLLECTION_UPDATE_SUCCESS = 'COLLECTION_UPDATE_SUCCESS';
export const COLLECTION_UPDATE_FAILED = 'COLLECTION_UPDATE_FAILED';

export const COMMUNITY_UPDATING = 'COMMUNITY_UPDATING';
export const COMMUNITY_UPDATE_SUCCESS = 'COMMUNITY_UPDATE_SUCCESS';
export const COMMUNITY_UPDATE_FAILED = 'COMMUNITY_UPDATE_FAILED';

// ISSN links
export const ISSN_SHERPA_LOADING = 'ISSN_SHERPA_LOADING';
export const ISSN_SHERPA_LOADED = 'ISSN_SHERPA_LOADED';
export const ISSN_SHERPA_LOAD_FAILED = 'ISSN_SHERPA_LOAD_FAILED';

export const ISSN_ULRICHS_LOADING = 'ISSN_ULRICHS_LOADING';
export const ISSN_ULRICHS_LOADED = 'ISSN_ULRICHS_LOADED';
export const ISSN_ULRICHS_LOAD_FAILED = 'ISSN_ULRICHS_LOAD_FAILED';

// ORCID Sync
export const ORCID_SYNC_STATUS_LOADING = 'ORCID_SYNC_STATUS_LOADING';
export const ORCID_SYNC_STATUS_LOADED = 'ORCID_SYNC_STATUS_LOADED';
export const ORCID_SYNC_STATUS_LOAD_FAILED = 'ORCID_SYNC_STATUS_LOAD_FAILED';

export const ORCID_SYNC_REQUESTING = 'ORCID_SYNC_REQUESTING';
export const ORCID_SYNC_SUCCESS = 'ORCID_SYNC_SUCCESS';
export const ORCID_SYNC_FAILED = 'ORCID_SYNC_FAILED';

// Edit locks
export const UNLOCK_RECORD_INPROGRESS = 'UNLOCK_RECORD_INPROGRESS';
export const UNLOCK_RECORD_SUCCESS = 'UNLOCK_RECORD_SUCCESS';
export const UNLOCK_RECORD_FAILED = 'UNLOCK_RECORD_FAILED';

// Favourite Search
export const FAVOURITE_SEARCH_LIST_LOADING = 'FAVOURITE_SEARCH_LIST_LOADING';
export const FAVOURITE_SEARCH_LIST_LOADED = 'FAVOURITE_SEARCH_LIST_LOADED';
export const FAVOURITE_SEARCH_LIST_FAILED = 'FAVOURITE_SEARCH_LIST_FAILED';

export const FAVOURITE_SEARCH_ADDING = 'FAVOURITE_SEARCH_ADDING';
export const FAVOURITE_SEARCH_ADD_SUCCESS = 'FAVOURITE_SEARCH_ADD_SUCCESS';
export const FAVOURITE_SEARCH_ADD_FAILED = 'FAVOURITE_SEARCH_ADD_FAILED';

export const FAVOURITE_SEARCH_ITEM_UPDATING = 'FAVOURITE_SEARCH_ITEM_UPDATING';
export const FAVOURITE_SEARCH_ITEM_UPDATE_SUCCESS = 'FAVOURITE_SEARCH_ITEM_UPDATE_SUCCESS';
export const FAVOURITE_SEARCH_ITEM_UPDATE_FAILED = 'FAVOURITE_SEARCH_ITEM_UPDATE_FAILED';

export const FAVOURITE_SEARCH_ITEM_DELETING = 'FAVOURITE_SEARCH_ITEM_DELETING';
export const FAVOURITE_SEARCH_ITEM_DELETE_SUCCESS = 'FAVOURITE_SEARCH_ITEM_DELETE_SUCCESS';
export const FAVOURITE_SEARCH_ITEM_DELETE_FAILED = 'FAVOURITE_SEARCH_ITEM_DELETE_FAILED';

export const EXISTING_ALIAS_CHECK_IN_PROGRESS = 'EXISTING_ALIAS_CHECK_IN_PROGRESS';
export const EXISTING_ALIAS_FOUND = 'EXISTING_ALIAS_FOUND';
export const EXISTING_ALIAS_NOT_FOUND = 'EXISTING_ALIAS_NOT_FOUND';
export const EXISTING_ALIAS_CHECK_FAILED = 'EXISTING_ALIAS_CHECK_FAILED';

// Change display type
export const CHANGE_DISPLAY_TYPE_INPROGRESS = 'CHANGE_DISPLAY_TYPE_INPROGRESS';
export const CHANGE_DISPLAY_TYPE_SUCCESS = 'CHANGE_DISPLAY_TYPE_SUCCESS';
export const CHANGE_DISPLAY_TYPE_FAILED = 'CHANGE_DISPLAY_TYPE_FAILED';

export const CHANGE_AUTHOR_ID_INPROGRESS = 'CHANGE_AUTHOR_ID_INPROGRESS';
export const CHANGE_AUTHOR_ID_SUCCESS = 'CHANGE_AUTHOR_ID_SUCCESS';
export const CHANGE_AUTHOR_ID_FAILED = 'CHANGE_AUTHOR_ID_FAILED';

export const CHANGE_SEARCH_KEY_VALUE_INPROGRESS = 'CHANGE_SEARCH_KEY_VALUE_INPROGRESS';
export const CHANGE_SEARCH_KEY_VALUE_SUCCESS = 'CHANGE_SEARCH_KEY_VALUE_SUCCESS';
export const CHANGE_SEARCH_KEY_VALUE_FAILED = 'CHANGE_SEARCH_KEY_VALUE_FAILED';

export const CHANGE_COLLECTIONS_INPROGRESS = 'CHANGE_COLLECTIONS_INPROGRESS';
export const CHANGE_COLLECTIONS_SUCCESS = 'CHANGE_COLLECTIONS_SUCCESS';
export const CHANGE_COLLECTIONS_FAILED = 'CHANGE_COLLECTIONS_FAILED';

export const CHANGE_COMMUNITIES_INPROGRESS = 'CHANGE_COMMUNITIES_INPROGRESS';
export const CHANGE_COMMUNITIES_SUCCESS = 'CHANGE_COMMUNITIES_SUCCESS';
export const CHANGE_COMMUNITIES_FAILED = 'CHANGE_COMMUNITIES_FAILED';

export const CREATE_OR_UPDATE_DOI_INPROGRESS = 'CREATE_OR_UPDATE_DOI_INPROGRESS';
export const CREATE_OR_UPDATE_DOI_SUCCESS = 'CREATE_OR_UPDATE_DOI_SUCCESS';
export const CREATE_OR_UPDATE_DOI_FAILED = 'CREATE_OR_UPDATE_DOI_FAILED';

export const MY_EDITORIAL_APPOINTMENT_LIST_LOADING = 'MY_EDITORIAL_APPOINTMENT_LIST_LOADING';
export const MY_EDITORIAL_APPOINTMENT_LIST_LOADED = 'MY_EDITORIAL_APPOINTMENT_LIST_LOADED';
export const MY_EDITORIAL_APPOINTMENT_LIST_FAILED = 'MY_EDITORIAL_APPOINTMENT_LIST_FAILED';

export const MY_EDITORIAL_APPOINTMENT_ADDING = 'MY_EDITORIAL_APPOINTMENT_ADDING';
export const MY_EDITORIAL_APPOINTMENT_ADD_SUCCESS = 'MY_EDITORIAL_APPOINTMENT_ADD_SUCCESS';
export const MY_EDITORIAL_APPOINTMENT_ADD_FAILED = 'MY_EDITORIAL_APPOINTMENT_ADD_FAILED';
export const MY_EDITORIAL_APPOINTMENT_ADD_CLEAR = 'MY_EDITORIAL_APPOINTMENT_ADD_CLEAR';

export const MY_EDITORIAL_APPOINTMENT_ITEM_UPDATING = 'MY_EDITORIAL_APPOINTMENT_ITEM_UPDATING';
export const MY_EDITORIAL_APPOINTMENT_ITEM_UPDATE_SUCCESS = 'MY_EDITORIAL_APPOINTMENT_ITEM_UPDATE_SUCCESS';
export const MY_EDITORIAL_APPOINTMENT_ITEM_UPDATE_FAILED = 'MY_EDITORIAL_APPOINTMENT_ITEM_UPDATE_FAILED';

export const MY_EDITORIAL_APPOINTMENT_ITEM_DELETING = 'MY_EDITORIAL_APPOINTMENT_ITEM_DELETING';
export const MY_EDITORIAL_APPOINTMENT_ITEM_DELETE_SUCCESS = 'MY_EDITORIAL_APPOINTMENT_ITEM_DELETE_SUCCESS';
export const MY_EDITORIAL_APPOINTMENT_ITEM_DELETE_FAILED = 'MY_EDITORIAL_APPOINTMENT_ITEM_DELETE_FAILED';

// Lookup Journal names
export const JOURNAL_LOOKUP_LOADING = 'JOURNAL_LOOKUP_LOADING';
export const JOURNAL_LOOKUP_LOADED = 'JOURNAL_LOOKUP_LOADED';
export const JOURNAL_LOOKUP_FAILED = 'JOURNAL_LOOKUP_FAILED';

export const VIEW_JOURNAL_LOADING = 'VIEW_JOURNAL_LOADING';
export const VIEW_JOURNAL_LOADED = 'VIEW_JOURNAL_LOADED';
export const VIEW_JOURNAL_LOAD_FAILED = 'VIEW_JOURNAL_LOAD_FAILED';

// Master Journal List ingest
export const MASTER_JOURNAL_LIST_INGEST_REQUESTING = 'MASTER_JOURNAL_LIST_INGEST_REQUESTING';
export const MASTER_JOURNAL_LIST_INGEST_REQUESTED = 'MASTER_JOURNAL_LIST_INGEST_REQUESTED';
export const MASTER_JOURNAL_LIST_INGEST_REQUEST_FAILED = 'MASTER_JOURNAL_LIST_INGEST_REQUEST_FAILED';

export const AUTHOR_LIST_LOADING = 'AUTHOR_LIST_LOADING';
export const AUTHOR_LIST_LOADED = 'AUTHOR_LIST_LOADED';
export const AUTHOR_LIST_FAILED = 'AUTHOR_LIST_FAILED';

export const AUTHOR_ADDING = 'AUTHOR_ADDING';
export const AUTHOR_ADD_SUCCESS = 'AUTHOR_ADD_SUCCESS';
export const AUTHOR_ADD_FAILED = 'AUTHOR_ADD_FAILED';

export const AUTHOR_ITEM_UPDATING = 'AUTHOR_ITEM_UPDATING';
export const AUTHOR_ITEM_UPDATE_SUCCESS = 'AUTHOR_ITEM_UPDATE_SUCCESS';
export const AUTHOR_ITEM_UPDATE_FAILED = 'AUTHOR_ITEM_UPDATE_FAILED';

export const AUTHOR_ITEM_DELETING = 'AUTHOR_ITEM_DELETING';
export const AUTHOR_ITEM_DELETE_SUCCESS = 'AUTHOR_ITEM_DELETE_SUCCESS';
export const AUTHOR_ITEM_DELETE_FAILED = 'AUTHOR_ITEM_DELETE_FAILED';

export const USER_LIST_LOADING = 'USER_LIST_LOADING';
export const USER_LIST_LOADED = 'USER_LIST_LOADED';
export const USER_LIST_FAILED = 'USER_LIST_FAILED';

export const USER_ADDING = 'USER_ADDING';
export const USER_ADD_SUCCESS = 'USER_ADD_SUCCESS';
export const USER_ADD_FAILED = 'USER_ADD_FAILED';

export const USER_ITEM_UPDATING = 'USER_ITEM_UPDATING';
export const USER_ITEM_UPDATE_SUCCESS = 'USER_ITEM_UPDATE_SUCCESS';
export const USER_ITEM_UPDATE_FAILED = 'USER_ITEM_UPDATE_FAILED';

export const USER_ITEM_DELETING = 'USER_ITEM_DELETING';
export const USER_ITEM_DELETE_SUCCESS = 'USER_ITEM_DELETE_SUCCESS';
export const USER_ITEM_DELETE_FAILED = 'USER_ITEM_DELETE_FAILED';

export const CHECKING_EXISTING_AUTHOR = 'CHECKING_EXISTING_AUTHOR';
export const CHECKING_EXISTING_AUTHOR_FAILED = 'CHECKING_EXISTING_AUTHOR_FAILED';
export const EXISTING_AUTHOR_FOUND = 'EXISTING_AUTHOR_FOUND';
export const EXISTING_AUTHOR_NOT_FOUND = 'EXISTING_AUTHOR_NOT_FOUND';

export const BULK_USER_ITEMS_DELETING = 'BULK_USER_ITEMS_DELETING';
export const BULK_USER_ITEMS_DELETE_SUCCESS = 'BULK_USER_ITEMS_DELETE_SUCCESS';
export const BULK_USER_ITEMS_DELETE_FAILED = 'BULK_USER_ITEMS_DELETE_FAILED';

export const BULK_AUTHOR_ITEMS_DELETING = 'BULK_AUTHOR_ITEMS_DELETING';
export const BULK_AUTHOR_ITEMS_DELETE_SUCCESS = 'BULK_AUTHOR_ITEMS_DELETE_SUCCESS';
export const BULK_AUTHOR_ITEMS_DELETE_FAILED = 'BULK_AUTHOR_ITEMS_DELETE_FAILED';

export const SCOPUS_INGEST_REQUESTING = 'SCOPUS_INGEST_REQUESTING';
export const SCOPUS_INGEST_REQUEST_SUCCESS = 'SCOPUS_INGEST_REQUEST_SUCCESS';
export const SCOPUS_INGEST_REQUEST_FAILED = 'SCOPUS_INGEST_REQUEST_FAILED';

export const CHECKING_EXISTING_USER = 'CHECKING_EXISTING_USER';
export const CHECKING_EXISTING_USER_FAILED = 'CHECKING_EXISTING_USER_FAILED';
export const EXISTING_USER_FOUND = 'EXISTING_USER_FOUND';
export const EXISTING_USER_NOT_FOUND = 'EXISTING_USER_NOT_FOUND';

export const USER_CLEAR_ALERTS = 'USER_CLEAR_ALERTS';
export const AUTHOR_CLEAR_ALERTS = 'AUTHOR_CLEAR_ALERTS';

// Communities and Collections
export const VIEW_COMMUNITIES_LOADING = 'VIEW_COMMUNITIES_LOADING';
export const VIEW_COMMUNITIES_LOADED = 'VIEW_COMMUNITIES_LOADED';
export const VIEW_COMMUNITIES_LOAD_FAILED = 'VIEW_COMMUNITIES_LOAD_FAILED';

export const VIEW_COLLECTIONS_LOADING = 'VIEW_COLLECTIONS_LOADING';
export const VIEW_COLLECTIONS_LOADED = 'VIEW_COLLECTIONS_LOADED';
export const VIEW_COLLECTIONS_LOAD_FAILED = 'VIEW_COLLECTIONS_LOAD_FAILED';
export const VIEW_COLLECTIONS_CLEARED = 'VIEW_COLLECTIONS_CLEARED';
export const SET_COLLECTIONS_ARRAY = 'SET_COLLECTIONS_ARRAY';

export const JOURNAL_SEARCH_KEYWORDS_LOADING = 'JOURNAL_SEARCH_KEYWORDS_LOADING';
export const JOURNAL_SEARCH_KEYWORDS_LOADED = 'JOURNAL_SEARCH_KEYWORDS_LOADED';
export const JOURNAL_SEARCH_KEYWORDS_FAILED = 'JOURNAL_SEARCH_KEYWORDS_FAILED';
export const CLEAR_JOURNAL_SEARCH_KEYWORDS = 'CLEAR_JOURNAL_SEARCH_KEYWORDS';

export const SEARCH_JOURNALS_LOADING = 'SEARCH_JOURNALS_LOADING';
export const SEARCH_JOURNALS_LOADED = 'SEARCH_JOURNALS_LOADED';
export const SEARCH_JOURNALS_FAILED = 'SEARCH_JOURNALS_FAILED';

export const EXPORT_JOURNALS_LOADING = 'EXPORT_JOURNALS_LOADING';
export const EXPORT_JOURNALS_LOADED = 'EXPORT_JOURNALS_LOADED';
export const EXPORT_JOURNALS_FAILED = 'EXPORT_JOURNALS_FAILED';

export const EXPORT_FAVOURITE_JOURNALS_LOADING = 'EXPORT_FAVOURITE_JOURNALS_LOADING';
export const EXPORT_FAVOURITE_JOURNALS_LOADED = 'EXPORT_FAVOURITE_JOURNALS_LOADED';
export const EXPORT_FAVOURITE_JOURNALS_FAILED = 'EXPORT_FAVOURITE_JOURNALS_FAILED';

export const FAVOURITE_JOURNALS_LOADING = 'FAVOURITE_JOURNALS_LOADING';
export const FAVOURITE_JOURNALS_LOADED = 'FAVOURITE_JOURNALS_LOADED';
export const FAVOURITE_JOURNALS_FAILED = 'FAVOURITE_JOURNALS_FAILED';

export const FAVOURITE_JOURNALS_ADD_REQUESTING = 'FAVOURITE_JOURNALS_ADD_REQUESTING';
export const FAVOURITE_JOURNALS_ADD_SUCCESS = 'FAVOURITE_JOURNALS_ADD_SUCCESS';
export const FAVOURITE_JOURNALS_ADD_FAILED = 'FAVOURITE_JOURNALS_ADD_FAILED';

export const FAVOURITE_JOURNALS_REMOVE_REQUESTING = 'FAVOURITE_JOURNALS_REMOVE_REQUESTING';
export const FAVOURITE_JOURNALS_REMOVE_SUCCESS = 'FAVOURITE_JOURNALS_REMOVE_SUCCESS';
export const FAVOURITE_JOURNALS_REMOVE_FAILED = 'FAVOURITE_JOURNALS_REMOVE_FAILED';

// Detailed Record History
export const DETAILED_HISTORY_LOADING = 'DETAILED_HISTORY_LOADING';
export const DETAILED_HISTORY_LOADING_FAILED = 'DETAILED_HISTORY_LOADING_FAILED';
export const DETAILED_HISTORY_LOADING_SUCCESS = 'DETAILED_HISTORY_LOADING_SUCCESS';

// Organisational Units
export const ORGANISATIONAL_UNITS_LOADING = 'ORGANISATIONAL_UNITS_LOADING';
export const ORGANISATIONAL_UNITS_LOADED = 'ORGANISATIONAL_UNITS_LOADED';
export const ORGANISATIONAL_UNITS_FAILED = 'ORGANISATIONAL_UNITS_FAILED';
// export const ORGANISATIONAL_UNITS_CLEARED = 'ORGANISATIONAL_UNITS_CLEARED';

export const SUGGESTED_ORGANISATIONAL_UNITS_LOADING = 'SUGGESTED_ORGANISATIONAL_UNITS_LOADING';
export const SUGGESTED_ORGANISATIONAL_UNITS_LOADED = 'SUGGESTED_ORGANISATIONAL_UNITS_LOADED';
export const SUGGESTED_ORGANISATIONAL_UNITS_FAILED = 'SUGGESTED_ORGANISATIONAL_UNITS_FAILED';
export const SUGGESTED_ORGANISATIONAL_UNITS_CLEARED = 'SUGGESTED_ORGANISATIONAL_UNITS_CLEARED';

// Admin Journal edit
export const ADMIN_UPDATE_JOURNAL_PROCESSING = 'ADMIN_UPDATE_JOURNAL_PROCESSING';
export const ADMIN_UPDATE_JOURNAL_SUCCESS = 'ADMIN_UPDATE_JOURNAL_SUCCESS';
export const ADMIN_UPDATE_JOURNAL_FAILED = 'ADMIN_UPDATE_JOURNAL_FAILED';
export const ADMIN_JOURNAL_CLEAR = 'ADMIN_JOURNAL_CLEAR';
export const ADMIN_JOURNAL_UNLOCK = 'ADMIN_JOURNAL_UNLOCK';

// Admin Dashboard
export const ADMIN_DASHBOARD_CONFIG_LOADING = 'ADMIN_DASHBOARD_CONFIG_LOADING';
export const ADMIN_DASHBOARD_CONFIG_SUCCESS = 'ADMIN_DASHBOARD_CONFIG_SUCCESS';
export const ADMIN_DASHBOARD_CONFIG_FAILED = 'ADMIN_DASHBOARD_CONFIG_FAILED';
export const ADMIN_DASHBOARD_CONFIG_CLEAR = 'ADMIN_DASHBOARD_CONFIG_CLEAR';

export const ADMIN_DASHBOARD_TODAY_LOADING = 'ADMIN_DASHBOARD_TODAY_LOADING';
export const ADMIN_DASHBOARD_TODAY_SUCCESS = 'ADMIN_DASHBOARD_TODAY_SUCCESS';
export const ADMIN_DASHBOARD_TODAY_FAILED = 'ADMIN_DASHBOARD_TODAY_FAILED';
export const ADMIN_DASHBOARD_TODAY_CLEAR = 'ADMIN_DASHBOARD_TODAY_CLEAR';

export const ADMIN_DASHBOARD_QUICKLINKS_LOADING = 'ADMIN_DASHBOARD_QUICKLINKS_LOADING';
export const ADMIN_DASHBOARD_QUICKLINKS_SUCCESS = 'ADMIN_DASHBOARD_QUICKLINKS_SUCCESS';
export const ADMIN_DASHBOARD_QUICKLINKS_FAILED = 'ADMIN_DASHBOARD_QUICKLINKS_FAILED';
export const ADMIN_DASHBOARD_QUICKLINKS_CLEAR = 'ADMIN_DASHBOARD_QUICKLINKS_CLEAR';
export const ADMIN_DASHBOARD_QUICKLINKS_UPDATING = 'ADMIN_DASHBOARD_QUICKLINKS_UPDATING';
export const ADMIN_DASHBOARD_QUICKLINKS_UPDATE_SUCCESS = 'ADMIN_DASHBOARD_QUICKLINKS_UPDATE_SUCCESS';
export const ADMIN_DASHBOARD_QUICKLINKS_UPDATE_FAILED = 'ADMIN_DASHBOARD_QUICKLINKS_UPDATE_FAILED';
export const ADMIN_DASHBOARD_QUICKLINKS_UPDATE_CLEAR = 'ADMIN_DASHBOARD_QUICKLINKS_UPDATE_CLEAR';

export const ADMIN_DASHBOARD_SYSTEM_ALERTS_LOADING = 'ADMIN_DASHBOARD_SYSTEM_ALERTS_LOADING';
export const ADMIN_DASHBOARD_SYSTEM_ALERTS_SUCCESS = 'ADMIN_DASHBOARD_SYSTEM_ALERTS_SUCCESS';
export const ADMIN_DASHBOARD_SYSTEM_ALERTS_FAILED = 'ADMIN_DASHBOARD_SYSTEM_ALERTS_FAILED';
export const ADMIN_DASHBOARD_SYSTEM_ALERTS_CLEAR = 'ADMIN_DASHBOARD_SYSTEM_ALERTS_CLEAR';

export const ADMIN_DASHBOARD_SYSTEM_ALERT_UPDATING = 'ADMIN_DASHBOARD_SYSTEM_ALERT_UPDATING';
export const ADMIN_DASHBOARD_SYSTEM_ALERT_UPDATE_SUCCESS = 'ADMIN_DASHBOARD_SYSTEM_ALERT_UPDATE_SUCCESS';
export const ADMIN_DASHBOARD_SYSTEM_ALERT_UPDATE_FAILED = 'ADMIN_DASHBOARD_SYSTEM_ALERT_UPDATE_FAILED';
export const ADMIN_DASHBOARD_SYSTEM_ALERTS_UPDATE_CLEAR = 'ADMIN_DASHBOARD_SYSTEM_ALERTS_UPDATE_CLEAR';

export const ADMIN_DASHBOARD_EXPORT_REPORT_LOADING = 'ADMIN_DASHBOARD_EXPORT_REPORT_LOADING';
export const ADMIN_DASHBOARD_EXPORT_REPORT_SUCCESS = 'ADMIN_DASHBOARD_EXPORT_REPORT_SUCCESS';
export const ADMIN_DASHBOARD_EXPORT_REPORT_FAILED = 'ADMIN_DASHBOARD_EXPORT_REPORT_FAILED';
export const ADMIN_DASHBOARD_EXPORT_REPORT_CLEAR = 'ADMIN_DASHBOARD_EXPORT_REPORT_CLEAR';

export const ADMIN_DASHBOARD_DISPLAY_REPORT_LOADING = 'ADMIN_DASHBOARD_DISPLAY_REPORT_LOADING';
export const ADMIN_DASHBOARD_DISPLAY_REPORT_SUCCESS = 'ADMIN_DASHBOARD_DISPLAY_REPORT_SUCCESS';
export const ADMIN_DASHBOARD_DISPLAY_REPORT_FAILED = 'ADMIN_DASHBOARD_DISPLAY_REPORT_FAILED';
export const ADMIN_DASHBOARD_DISPLAY_REPORT_CLEAR = 'ADMIN_DASHBOARD_DISPLAY_REPORT_CLEAR';
