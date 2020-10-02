// Bulk updates action values for dropdown
export const BUA_CHANGE_AUTHOR_ID = 'change-author-id';
export const BUA_CHANGE_DISPLAY_TYPE = 'change-display-type';
export const BUA_COPY_TO_COLLECTION = 'copy-to-collection';
export const BUA_REMOVE_FROM_COLLECTION = 'remove-from-collection';
export const BUA_CHANGE_SEARCHKEY_VALUE = 'change-searchkey-value';
export const BUA_UPDATE_SECURITY = 'update-security';

// Bulk updates action options
export const BUA_CHANGE_AUTHOR_ID_OPTION = {
    value: BUA_CHANGE_AUTHOR_ID,
    text: 'Change Author ID',
};

export const BUA_CHANGE_DISPLAY_TYPE_OPTION = {
    value: BUA_CHANGE_DISPLAY_TYPE,
    text: 'Change display type',
};

export const BUA_COPY_TO_COLLECTION_OPTION = {
    value: BUA_COPY_TO_COLLECTION,
    text: 'Copy to collection',
};

export const BUA_REMOVE_FROM_COLLECTION_OPTION = {
    value: BUA_REMOVE_FROM_COLLECTION,
    text: 'Remove from collection',
};

export const BUA_CHANGE_SEARCHKEY_VALUE_OPTION = {
    value: BUA_CHANGE_SEARCHKEY_VALUE,
    text: 'Change searchkey value',
};

export const BUA_UPDATE_SECURITY_OPTION = {
    value: BUA_UPDATE_SECURITY,
    text: 'Update security',
};

// Bulk updates actions for dropdown
export const BULK_UPDATES_ACTIONS = {
    [BUA_CHANGE_AUTHOR_ID]: BUA_CHANGE_AUTHOR_ID_OPTION,
    [BUA_CHANGE_DISPLAY_TYPE]: BUA_CHANGE_DISPLAY_TYPE_OPTION,
    [BUA_COPY_TO_COLLECTION]: BUA_COPY_TO_COLLECTION_OPTION,
    [BUA_REMOVE_FROM_COLLECTION]: BUA_REMOVE_FROM_COLLECTION_OPTION,
    [BUA_CHANGE_SEARCHKEY_VALUE]: BUA_CHANGE_SEARCHKEY_VALUE_OPTION,
    [BUA_UPDATE_SECURITY]: BUA_UPDATE_SECURITY_OPTION,
};

// Bulk updates search key options values
export const BULK_UPDATE_SEARCH_KEY_OA_STATUS = 'fez_record_search_key_oa_status.rek_oa_status';
export const BULK_UPDATE_SEARCH_KEY_SCOPUS_DOC_TYPE = 'rek_scopus_doc_type';
export const BULK_UPDATE_SEARCH_KEY_WOK_DOC_TYPE = 'rek_wok_doc_type';
export const BULK_UPDATE_SEARCH_KEY_ORG_UNIT_NAME = 'fez_record_search_key_org_unit_name.rek_org_unit_name';
export const BULK_UPDATE_SEARCH_KEY_ADDITIONAL_NOTES = 'fez_record_search_key_notes.rek_notes';
export const BULK_UPDATE_SEARCH_KEY_SERIES = 'fez_record_search_key_series.rek_series';
export const BULK_UPDATE_SEARCH_KEY_RIGHTS = 'fez_record_search_key_rights.rek_rights';
export const BULK_UPDATE_SEARCH_KEY_ADVISORY_STATEMENT =
    'fez_record_search_key_advisory_statement.rek_advisory_statement';

export const BULK_UPDATE_SEARCH_KEYS = {
    [BULK_UPDATE_SEARCH_KEY_OA_STATUS]: {
        value: BULK_UPDATE_SEARCH_KEY_OA_STATUS,
        text: 'OA status',
    },
    [BULK_UPDATE_SEARCH_KEY_SCOPUS_DOC_TYPE]: {
        value: BULK_UPDATE_SEARCH_KEY_SCOPUS_DOC_TYPE,
        text: 'Scopus doc type',
    },
    [BULK_UPDATE_SEARCH_KEY_WOK_DOC_TYPE]: {
        value: BULK_UPDATE_SEARCH_KEY_WOK_DOC_TYPE,
        text: 'WOK doc type',
    },
    [BULK_UPDATE_SEARCH_KEY_ORG_UNIT_NAME]: {
        value: BULK_UPDATE_SEARCH_KEY_ORG_UNIT_NAME,
        text: 'School, Centre or Institute',
    },
    [BULK_UPDATE_SEARCH_KEY_ADDITIONAL_NOTES]: {
        value: BULK_UPDATE_SEARCH_KEY_ADDITIONAL_NOTES,
        text: 'Additional notes',
    },
    [BULK_UPDATE_SEARCH_KEY_SERIES]: {
        value: BULK_UPDATE_SEARCH_KEY_SERIES,
        text: 'Series',
    },
    [BULK_UPDATE_SEARCH_KEY_RIGHTS]: {
        value: BULK_UPDATE_SEARCH_KEY_RIGHTS,
        text: 'Copyright notice',
    },
    [BULK_UPDATE_SEARCH_KEY_ADVISORY_STATEMENT]: {
        value: BULK_UPDATE_SEARCH_KEY_ADVISORY_STATEMENT,
        text: 'Advisory statement',
    },
};
