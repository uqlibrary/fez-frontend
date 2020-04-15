import React from 'react';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { QUALITY_INDICATORS } from 'config/general';
import Immutable from 'immutable';

export default function QualityIndicatorField(fieldProps) {
    const input = !!fieldProps.input && fieldProps.input.value;
    return (
        <GenericSelectField
            itemsList={QUALITY_INDICATORS}
            hideLabel={false}
            locale={{ label: fieldProps.label, placeholder: fieldProps.placeholder }}
            value={
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
