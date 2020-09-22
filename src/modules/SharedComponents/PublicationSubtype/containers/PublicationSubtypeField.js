import React from 'react';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { usePublicationSubtype } from 'hooks';

export const PublicationSubtypeField = fieldProps => {
    const subtypes = usePublicationSubtype(null, true);
    return (
        <GenericSelectField
            onChange={fieldProps.input.onChange}
            value={(!!fieldProps.input && fieldProps.input.value) || fieldProps.value}
            itemsList={['Select a document subtype', ...subtypes.map(type => ({ value: type }))]}
            genericSelectFieldId="rek-subtype"
            {...fieldProps}
        />
    );
};
