import React from 'react';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { ANDS_COLLECTION_TYPE_COLLECTION, ANDS_COLLECTION_TYPE_DATASET } from 'config/general';

export default function AndsCollectionTypesField(fieldProps) {
    return (
        <GenericSelectField
            hideLabel={false}
            locale={{ label: fieldProps.label }}
            value={fieldProps.input.value}
            onChange={!!fieldProps.input && fieldProps.input.onChange}
            itemsList={[
                {
                    value: ANDS_COLLECTION_TYPE_COLLECTION,
                    text: 'Collection',
                },
                {
                    value: ANDS_COLLECTION_TYPE_DATASET,
                    text: 'Dataset',
                },
            ]}
            errorText={(!!fieldProps.meta && fieldProps.meta.error) || ''}
            error={(!!fieldProps.meta && !!fieldProps.meta.error) || false}
            {...fieldProps}
        />
    );
}
