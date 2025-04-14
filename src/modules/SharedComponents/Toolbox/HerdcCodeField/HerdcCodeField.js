import React from 'react';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { DEPRECATED_HERDC_CODES, HERDC_CODES } from 'config/general';

/**
 * Supply the list of herdc codes to display as options in the drop down.
 * If the input value is not in the current list, but is in the deprecated list, add it to the list to display.
 * @param input - the herdc code to be preselected in the list
 * @returns []
 * @private
 */
const _herdcCodes = input => {
    const herdcCodes = [{ value: '0', text: 'None' }, ...HERDC_CODES];
    if (!HERDC_CODES.find(herdc => herdc.value === input)) {
        const foundDeprecated = DEPRECATED_HERDC_CODES.filter(obj => {
            // just comparing obj.value === input works in tests but not in actual form :(
            return obj.value.toString(10) === input.toString(10);
        });
        if (foundDeprecated.length > 0) {
            herdcCodes.push(foundDeprecated[0]);
        }
    }
    return herdcCodes;
};

export default function HerdcCodeField(fieldProps) {
    const preselected = !!fieldProps.input && fieldProps.input.value;
    const itemsList = [..._herdcCodes(preselected)];
    return (
        <NewGenericSelectField
            itemsList={itemsList}
            locale={{ label: fieldProps.label }}
            value={(!!fieldProps.input && fieldProps.input.value) || ''}
            onChange={(!!fieldProps.input && fieldProps.input.onChange) || undefined}
            errorText={(!!fieldProps.meta && fieldProps.meta.error) || ''}
            error={(!!fieldProps.meta && !!fieldProps.meta.error) || false}
            genericSelectFieldId="rek-herdc-code"
            canUnselect
            {...fieldProps}
        />
    );
}
