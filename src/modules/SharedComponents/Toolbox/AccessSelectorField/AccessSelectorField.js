import React from 'react';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { OPEN_ACCESS_ID, MEDIATED_ACCESS_ID } from 'config/general';

export default function AccessSelectorField(fieldProps) {
    return (
        <GenericSelectField
            hideLabel={false}
            locale={{ label: fieldProps.label }}
            selectedValue={fieldProps.input.value}
            onChange={!!fieldProps.input && fieldProps.input.onChange}
            itemsList={[
                {
                    value: OPEN_ACCESS_ID,
                    text: 'Open Access',
                },
                {
                    value: MEDIATED_ACCESS_ID,
                    text: 'Mediated Access',
                },
            ]}
            errorText={(!!fieldProps.meta && fieldProps.meta.error) || ''}
            error={(!!fieldProps.meta && !!fieldProps.meta.error) || false}
            {...fieldProps}
        />
    );
}
