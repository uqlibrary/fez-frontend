import React from 'react';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { usePublicationSubtype } from 'hooks';

export const PublicationSubtypeField = fieldProps => {
    const subtypes = usePublicationSubtype(fieldProps.displayType || null, true);

    return (
        <GenericSelectField
            error={!!fieldProps.meta && fieldProps.meta.error}
            errorText={!!fieldProps.meta && fieldProps.meta.error}
            onChange={(!!fieldProps.input && fieldProps.input.onChange) || fieldProps.onChange}
            value={(!!fieldProps.input && fieldProps.input.value) || fieldProps.value}
            itemsList={['Select a document subtype', ...subtypes.map(type => ({ value: type }))]}
            genericSelectFieldId="rek-subtype"
            {...fieldProps}
        />
    );
};
