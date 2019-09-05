import React from 'react';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { ALTERNATE_GENRE } from 'config/general';
import Immutable from 'immutable';

export default function AlternateGenreField(fieldProps) {
    const input = !!fieldProps.input && fieldProps.input.value;
    return (
        <GenericSelectField
            errorText={(!!fieldProps.meta && fieldProps.meta.error) || ''}
            error={(!!fieldProps.meta && !!fieldProps.meta.error) || false}
            hideLabel={false}
            itemsList={ALTERNATE_GENRE}
            locale={{ label: fieldProps.label }}
            onChange={(!!fieldProps.input && fieldProps.input.onChange) || undefined}
            selectedValue={
                input instanceof Immutable.List
                    ? input.toJS()
                    : (!!fieldProps.defaultValue && [fieldProps.defaultValue]) || input || []
            }
            {...fieldProps}
        />
    );
}
