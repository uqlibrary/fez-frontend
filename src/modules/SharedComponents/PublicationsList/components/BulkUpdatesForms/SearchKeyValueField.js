import React from 'react';
import Immutable from 'immutable';

import { OAStatusField } from 'modules/SharedComponents/Toolbox/OAStatusField';
import { ScopusDocTypesField } from 'modules/SharedComponents/Toolbox/ScopusDocTypesField';
import { WoSDocTypesField } from 'modules/SharedComponents/Toolbox/WoSDocTypesField';
import { OrgUnitNameField, SeriesField } from 'modules/SharedComponents/LookupFields';
import { RichEditorField } from 'modules/SharedComponents/RichEditor';
import { TextField as GenericTextField } from 'modules/SharedComponents/Toolbox/TextField';

import {
    BULK_UPDATE_SEARCH_KEY_ADDITIONAL_NOTES,
    BULK_UPDATE_SEARCH_KEY_ADVISORY_STATEMENT,
    BULK_UPDATE_SEARCH_KEY_OA_STATUS,
    BULK_UPDATE_SEARCH_KEY_ORG_UNIT_NAME,
    BULK_UPDATE_SEARCH_KEY_RIGHTS,
    BULK_UPDATE_SEARCH_KEY_SCOPUS_DOC_TYPE,
    BULK_UPDATE_SEARCH_KEY_SERIES,
    BULK_UPDATE_SEARCH_KEY_WOK_DOC_TYPE,
} from 'config/bulkUpdates';

export const BULK_UPDATES_SEARCH_KEY_COMPONENTS = ({ searchKeyValueFieldId }) => ({
    [BULK_UPDATE_SEARCH_KEY_OA_STATUS]: {
        component: OAStatusField,
        componentProps: {
            name: 'fez_record_search_key_oa_status.rek_oa_status',
            genericSelectFieldId: searchKeyValueFieldId,
        },
    },
    [BULK_UPDATE_SEARCH_KEY_SCOPUS_DOC_TYPE]: {
        component: ScopusDocTypesField,
        componentProps: {
            name: 'rek_scopus_doc_type',
            genericSelectFieldId: searchKeyValueFieldId,
        },
    },
    [BULK_UPDATE_SEARCH_KEY_WOK_DOC_TYPE]: {
        component: WoSDocTypesField,
        componentProps: {
            name: 'rek_wok_doc_type',
            genericSelectFieldId: searchKeyValueFieldId,
        },
    },
    [BULK_UPDATE_SEARCH_KEY_ORG_UNIT_NAME]: {
        component: OrgUnitNameField,
        componentProps: {
            fullWidth: true,
            name: 'fez_record_search_key_org_unit_name.rek_org_unit_name',
            floatingLabelText: 'Search key value',
            showClear: true,
            orgUnitNameFieldId: searchKeyValueFieldId,
        },
    },
    [BULK_UPDATE_SEARCH_KEY_ADDITIONAL_NOTES]: {
        component: RichEditorField,
        componentProps: {
            name: 'additionalNotes',
            title: 'Search key value',
            titleProps: {
                variant: 'caption',
                style: {
                    opacity: 0.666,
                },
            },
            height: 100,
            format: value => Immutable.Map(value),
        },
    },
    [BULK_UPDATE_SEARCH_KEY_SERIES]: {
        component: SeriesField,
        componentProps: {
            fullWidth: true,
            name: 'fez_record_search_key_series.rek_series',
            floatingLabelText: 'Search key value',
            showClear: true,
            seriesFieldId: searchKeyValueFieldId,
        },
    },
    [BULK_UPDATE_SEARCH_KEY_RIGHTS]: {
        component: GenericTextField,
        componentProps: {
            textFieldId: searchKeyValueFieldId,
            name: 'fez_record_search_key_rights.rek_rights',
            fullWidth: true,
            placeholder: '',
        },
    },
    [BULK_UPDATE_SEARCH_KEY_ADVISORY_STATEMENT]: {
        component: RichEditorField,
        componentProps: {
            name: 'advisoryStatement',
            title: 'Search key value',
            titleProps: {
                variant: 'caption',
                style: {
                    opacity: 0.666,
                },
            },
            height: 100,
            format: value => Immutable.Map(value),
        },
    },
});

export const SearchKeyValueField = fieldProps => {
    const { searchKeyValueFieldId, searchKey, ...rest } = fieldProps;
    const { component: SearchKeyValueComponent, componentProps } = BULK_UPDATES_SEARCH_KEY_COMPONENTS({
        searchKeyValueFieldId,
    })[searchKey];
    return <SearchKeyValueComponent onChange={fieldProps.input.onChange} {...componentProps} {...rest} />;
};

export default React.memo(SearchKeyValueField);
