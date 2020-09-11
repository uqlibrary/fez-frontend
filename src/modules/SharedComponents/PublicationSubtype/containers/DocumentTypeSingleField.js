import React from 'react';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { publicationTypes } from 'config';

const documentTypeList = () => {
    return Object.values(publicationTypes(false)).map(item => {
        return {
            value: item.id,
            text: item.name,
        };
    });
};

/**
 * provide a drop down that returns a Single Document Type (Publication type)
 * (see DocumentTypeMultipleField for selecting MULTIPLE document type)
 * @param fieldProps
 * @returns {*}
 * @constructor
 */
export default function DocumentTypeSingleField(fieldProps) {
    return (
        <GenericSelectField
            error={!!fieldProps.meta && fieldProps.meta.error}
            errorText={!!fieldProps.meta && fieldProps.meta.error}
            genericSelectFieldId="doc-type-id"
            itemsList={documentTypeList() || []}
            itemsLoadingHint={fieldProps.loadingHint || 'Loading..'}
            onChange={
                (!!fieldProps.input && fieldProps.input.onChange) || (!!fieldProps.onChange && fieldProps.onChange)
            }
            value={(!!fieldProps.input && fieldProps.input.value) || fieldProps.value || ''}
            {...fieldProps}
        />
    );
}
