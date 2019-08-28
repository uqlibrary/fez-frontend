import React from 'react';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { usePublicationSubtype } from 'hooks';

export const PublicationSubtypeField = fieldProps => {
    const subtypes = usePublicationSubtype();
    return (
        <GenericSelectField
            onChange={fieldProps.input.onChange}
            selectedValue={(!!fieldProps.input && fieldProps.input.value) || fieldProps.value}
            itemsList={['Select a document subtype', ...subtypes.map(type => ({ value: type }))]}
            {...fieldProps}
        />
    );
};
