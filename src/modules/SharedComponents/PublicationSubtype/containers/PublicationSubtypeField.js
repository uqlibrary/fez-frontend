import React from 'react';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { usePublicationSubtype } from 'hooks';

export const PublicationSubtypeField = fieldProps => {
    const subtypes = usePublicationSubtype(fieldProps.displayType || null, true);

    return (
        <NewGenericSelectField
            value={(!!fieldProps && fieldProps.value) || fieldProps.value || ''}
            itemsList={[...subtypes.map(type => ({ value: type, text: type }))]}
            selectPrompt="Select a document subtype"
            genericSelectFieldId="rek-subtype"
            {...fieldProps}
        />
    );
};
