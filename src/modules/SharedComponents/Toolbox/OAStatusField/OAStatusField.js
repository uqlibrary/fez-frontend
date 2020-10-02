import React from 'react';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { OA_STATUS } from 'config/general';
import Immutable from 'immutable';

export default function OAStatusField(fieldProps) {
    const input = !!fieldProps.input && fieldProps.input.value;
    return (
        <NewGenericSelectField
            canUnselect
            itemsList={OA_STATUS}
            hideLabel={false}
            locale={{ label: fieldProps.label }}
            value={
                input instanceof Immutable.List
                    ? input.toJS()
                    : input || (!!fieldProps.defaultValue && [fieldProps.defaultValue]) || -1
            }
            onChange={(!!fieldProps.input && fieldProps.input.onChange) || undefined}
            errorText={(!!fieldProps.meta && fieldProps.meta.error) || ''}
            error={(!!fieldProps.meta && !!fieldProps.meta.error) || false}
            genericSelectFieldId="rek-oa-status"
            selectPrompt="Please select an option"
            {...fieldProps}
        />
    );
}
