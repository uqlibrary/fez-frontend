import React from 'react';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { CURRENT_LICENCES, DEPRECATED_LICENCES } from 'config/general';

export default function LicenceSelectorField(fieldProps) {
    let licences = CURRENT_LICENCES;
    if (!!fieldProps.isAdmin) {
        licences = [
            {
                value: -1,
                text: 'None',
            },
            ...CURRENT_LICENCES.map(licence => {
                return {
                    value: licence.value,
                    text: licence.text + ' ' + licence.link,
                };
            }),
            ...DEPRECATED_LICENCES,
        ];
    }
    return (
        <GenericSelectField
            canUnselect
            hideLabel={false}
            locale={{ label: fieldProps.label }}
            value={fieldProps.input.value}
            onChange={!!fieldProps.input && fieldProps.input.onChange}
            itemsList={licences}
            errorText={(!!fieldProps.meta && fieldProps.meta.error) || ''}
            error={(!!fieldProps.meta && !!fieldProps.meta.error) || false}
            genericSelectFieldId="rek-license"
            {...fieldProps}
        />
    );
}
