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

import { OAStatusField } from 'modules/SharedComponents/Toolbox/OAStatusField';
import { ScopusDocTypesField } from 'modules/SharedComponents/Toolbox/ScopusDocTypesField';
import { WoSDocTypesField } from 'modules/SharedComponents/Toolbox/WoSDocTypesField';
import { OrgUnitNameField, SeriesField } from 'modules/SharedComponents/LookupFields';
import { RichEditorField } from 'modules/SharedComponents/RichEditor';
import { TextField as GenericTextField } from 'modules/SharedComponents/Toolbox/TextField';

// istanbul ignore next
const normalizeFn = value => (!!value && value.hasOwnProperty('htmlText') ? value.htmlText : null);

export const BULK_UPDATES_SEARCH_KEY_COMPONENTS = {
    [BULK_UPDATE_SEARCH_KEY_OA_STATUS]: {
        component: OAStatusField,
        componentProps: {
            genericSelectFieldId: 'rek-oa-status',
            normalize: value => parseInt(value, 10),
        },
    },
    [BULK_UPDATE_SEARCH_KEY_SCOPUS_DOC_TYPE]: {
        component: ScopusDocTypesField,
        componentProps: {
            genericSelectFieldId: 'rek-scopus-doc-type',
        },
    },
    [BULK_UPDATE_SEARCH_KEY_WOK_DOC_TYPE]: {
        component: WoSDocTypesField,
        componentProps: {
            genericSelectFieldId: 'rek-wok-doc-type',
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
            error={!!fieldProps.meta.error}
            errorText={fieldProps.meta.error}
            itemsList={Object.values(BULK_UPDATE_SEARCH_KEYS)}
            onChange={fieldProps.input.onChange}
            value={fieldProps.input.value || -1}
            selectPrompt="Please select a search key"
            {...fieldProps}
        />
    );
};

export default React.memo(SearchKeyField);
