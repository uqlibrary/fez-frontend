import React from 'react';
import {GenericSelectField} from 'modules/SharedComponents/GenericSelectField';
import {LANGUAGE} from 'config/general';
import Immutable from 'immutable';

export default function LanguageField(fieldProps) {
    const input = !!fieldProps.input && fieldProps.input.value;
    return (
        <GenericSelectField
            itemsList={LANGUAGE}
            hideLabel={false}
            locale={{label: fieldProps.label}}
            selectedValue={input instanceof Immutable.List ? input.toJS() : input || []}
            onChange={!!fieldProps.input && fieldProps.input.onChange || undefined}
            errorText={!!fieldProps.meta && fieldProps.meta.error || ''}
            error={!!fieldProps.meta && !!fieldProps.meta.error || false}
            { ...fieldProps }
        />
    );
}
