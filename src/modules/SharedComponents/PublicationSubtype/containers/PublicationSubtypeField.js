import React from 'react';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { usePublicationSubtype } from 'hooks';

export const PublicationSubtypeField = fieldProps => {
    const subtypes = usePublicationSubtype(fieldProps.displayType || null, true);

    return (
        <NewGenericSelectField
            error={!!fieldProps.meta && fieldProps.meta.error}
            errorText={!!fieldProps.meta && fieldProps.meta.error}
            onChange={(!!fieldProps.input && fieldProps.input.onChange) || fieldProps.onChange}
            value={(!!fieldProps.input && fieldProps.input.value) || fieldProps.value}
            itemsList={[
                { value: -1, text: 'Select a document subtype', disabled: true },
                ...subtypes.map(type => ({ value: type, text: type })),
            ]}
            genericSelectFieldId="rek-subtype"
            {...fieldProps}
        />
    );
};
