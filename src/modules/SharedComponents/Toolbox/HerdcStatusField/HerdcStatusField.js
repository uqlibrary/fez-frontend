import React from 'react';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { HERDC_STATUS } from 'config/general';

export default function HerdcStatusField(fieldProps) {
    return (
        <NewGenericSelectField
            itemsList={HERDC_STATUS}
            locale={{ label: fieldProps.label }}
            value={(!!fieldProps && fieldProps.value) || ''}
            onChange={(!!fieldProps && fieldProps.onChange) || undefined}
            errorText={(!!fieldProps.state && fieldProps.state.error) || ''}
            error={!!fieldProps.state?.error}
            genericSelectFieldId="rek-herdc-status"
            {...fieldProps}
        />
    );
}
