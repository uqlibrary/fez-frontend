import React from 'react';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { OA_STATUS } from 'config/general';
import Immutable from 'immutable';

export default function OAStatusField(fieldProps) {
    const input = !!fieldProps.input && fieldProps.input.value;
    return (
        <GenericSelectField
            canUnselect
            itemsList={OA_STATUS}
            hideLabel={false}
            locale={{ label: fieldProps.label }}
            selectedValue={
                input instanceof Immutable.List
                    ? input.toJS()
                    : (!!fieldProps.defaultValue && [fieldProps.defaultValue]) || input || []
            }
            onChange={(!!fieldProps.input && fieldProps.input.onChange) || undefined}
            errorText={(!!fieldProps.meta && fieldProps.meta.error) || ''}
            error={(!!fieldProps.meta && !!fieldProps.meta.error) || false}
            {...fieldProps}
        />
    );
}
