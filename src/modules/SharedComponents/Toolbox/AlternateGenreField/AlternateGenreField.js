import React from 'react';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { ALTERNATE_GENRE } from 'config/general';
import Immutable from 'immutable';

export default function AlternateGenreField(fieldProps) {
    const input = !!fieldProps.input && fieldProps.input.value;
    return (
        <GenericSelectField
            itemsList={ALTERNATE_GENRE}
            hideLabel={false}
            locale={{ label: fieldProps.label }}
            value={
                input instanceof Immutable.List
                    ? input.toJS()
                    : (!!fieldProps.defaultValue && [fieldProps.defaultValue]) || input || []
            }
            onChange={(!!fieldProps.input && fieldProps.input.onChange) || undefined}
            errorText={(!!fieldProps.meta && fieldProps.meta.error) || ''}
            error={(!!fieldProps.meta && !!fieldProps.meta.error) || false}
            genericSelectFieldId="rek-alternate-genre"
            {...fieldProps}
        />
    );
}
