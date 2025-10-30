import React from 'react';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import {
    BULK_UPDATE_SEARCH_KEYS,
    BULK_UPDATE_SEARCH_KEY_ADDITIONAL_NOTES,
    BULK_UPDATE_SEARCH_KEY_ADVISORY_STATEMENT,
    BULK_UPDATE_SEARCH_KEY_OA_STATUS,
    BULK_UPDATE_SEARCH_KEY_ORG_UNIT_NAME,
    BULK_UPDATE_SEARCH_KEY_RIGHTS,
    BULK_UPDATE_SEARCH_KEY_SCOPUS_DOC_TYPE,
    BULK_UPDATE_SEARCH_KEY_SERIES,
    BULK_UPDATE_SEARCH_KEY_WOK_DOC_TYPE,
} from 'config/bulkUpdates';

import { OrgUnitNameField, SeriesField } from 'modules/SharedComponents/LookupFields';
import { RichEditorField } from 'modules/SharedComponents/RichEditor';
import { TextField as GenericTextField } from 'modules/SharedComponents/Toolbox/TextField';
import { OA_STATUS, SCOPUS_DOC_TYPES, WOS_DOC_TYPES } from 'config/general';
import { selectFields } from 'locale/selectFields';

// c8 ignore next
const normalizeFn = value => value.htmlText || value;

export const BULK_UPDATES_SEARCH_KEY_COMPONENTS = {
    [BULK_UPDATE_SEARCH_KEY_OA_STATUS]: {
        component: NewGenericSelectField,
        componentProps: {
            genericSelectFieldId: 'rek-oa-status',
            itemsList: OA_STATUS,
            normalize: value => parseInt(value, 10),
            ...selectFields.oaStatus,
        },
    },
    [BULK_UPDATE_SEARCH_KEY_SCOPUS_DOC_TYPE]: {
        component: NewGenericSelectField,
        componentProps: {
            genericSelectFieldId: 'rek-scopus-doc-type',
            itemsList: SCOPUS_DOC_TYPES,
            ...selectFields.scopusDocType,
        },
    },
    [BULK_UPDATE_SEARCH_KEY_WOK_DOC_TYPE]: {
        component: NewGenericSelectField,
        componentProps: {
            genericSelectFieldId: 'rek-wok-doc-type',
            itemsList: WOS_DOC_TYPES,
            ...selectFields.wokDocType,
        },
    },
    [BULK_UPDATE_SEARCH_KEY_ORG_UNIT_NAME]: {
        component: OrgUnitNameField,
        componentProps: {
            fullWidth: true,
            floatingLabelText: 'Search key value',
            showClear: true,
            orgUnitNameFieldId: 'rek-org-unit-name',
        },
    },
    [BULK_UPDATE_SEARCH_KEY_ADDITIONAL_NOTES]: {
        component: RichEditorField,
        componentProps: {
            title: 'Search key value',
            titleProps: {
                variant: 'caption',
                style: {
                    opacity: 0.666,
                },
            },
            height: 100,
            normalize: normalizeFn,
            richEditorId: 'rek-notes',
        },
    },
    [BULK_UPDATE_SEARCH_KEY_SERIES]: {
        component: SeriesField,
        componentProps: {
            fullWidth: true,
            floatingLabelText: 'Search key value',
            showClear: true,
            seriesFieldId: 'rek-series',
        },
    },
    [BULK_UPDATE_SEARCH_KEY_RIGHTS]: {
        component: GenericTextField,
        componentProps: {
            textFieldId: 'rek-rights',
            fullWidth: true,
            placeholder: '',
        },
    },
    [BULK_UPDATE_SEARCH_KEY_ADVISORY_STATEMENT]: {
        component: RichEditorField,
        componentProps: {
            title: 'Search key value',
            titleProps: {
                variant: 'caption',
                style: {
                    opacity: 0.666,
                },
            },
            height: 100,
            normalize: normalizeFn,
            richEditorId: 'rek-advisory-statement',
        },
    },
};

export const getSearchKeyValueField = searchKey => {
    return BULK_UPDATES_SEARCH_KEY_COMPONENTS[searchKey];
};

export const SearchKeyField = fieldProps => {
    return (
        <NewGenericSelectField
            itemsList={Object.values(BULK_UPDATE_SEARCH_KEYS)}
            value={fieldProps.value || ''}
            selectPrompt="Please select a search key"
            {...fieldProps}
        />
    );
};

export default React.memo(SearchKeyField);
