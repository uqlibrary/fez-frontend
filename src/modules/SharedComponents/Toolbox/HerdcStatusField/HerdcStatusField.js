import React from 'react';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { HERDC_STATUS } from 'config/general';

export default function HerdcStatusField(fieldProps) {
    return (
        <NewGenericSelectField
            itemsList={HERDC_STATUS}
            locale={{ label: fieldProps.label }}
            value={(!!fieldProps.input && fieldProps.input.value) || ''}
            onChange={(!!fieldProps.input && fieldProps.input.onChange) || undefined}
            errorText={(!!fieldProps.meta && fieldProps.meta.error) || ''}
            error={(!!fieldProps.meta && !!fieldProps.meta.error) || false}
            genericSelectFieldId="rek-herdc-status"
            {...fieldProps}
        />
    );
}
