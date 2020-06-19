import React from 'react';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { PUBMED_DOC_TYPES } from 'config/general';
import Immutable from 'immutable';

export default function PubmedDocTypesField(fieldProps) {
    const input = !!fieldProps.input && fieldProps.input.value;
    return (
        <GenericSelectField
            itemsList={PUBMED_DOC_TYPES}
            hideLabel={false}
            locale={{ label: fieldProps.label }}
            value={
                input instanceof Immutable.List
                    ? input.toJS()
                    : (!!fieldProps.defaultValue && [fieldProps.defaultValue]) || input || null
            }
            onChange={(!!fieldProps.input && fieldProps.input.onChange) || undefined}
            errorText={(!!fieldProps.meta && fieldProps.meta.error) || ''}
            error={(!!fieldProps.meta && !!fieldProps.meta.error) || false}
            genericSelectFieldId="rek-pubmed-doc-type"
            {...fieldProps}
        />
    );
}
