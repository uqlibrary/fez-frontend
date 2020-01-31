import React from 'react';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { DEPRECATED_HERDC_CODES, HERDC_CODES } from 'config/general';
import Immutable from 'immutable';

export default function HerdcCodeField(fieldProps) {
    const preselected = !!fieldProps.input && fieldProps.input.value;

    /**
     * Supply the list of herdc codes to display as options in the drop down.
     * If the input value is not in the current list, but is in the deprecated list, add it to the list to display.
     * @param input - the herdc code to be preselected in the list
     * @returns []
     * @private
     */
    const _herdcCodes = input => {
        const herdcCodes = HERDC_CODES;
        const herdcList = [];
        herdcCodes.forEach(obj => {
            herdcList[obj.value] = obj.text;
        });
        /* istanbul ignore else */
        if (herdcList.indexOf(input) === -1) {
            const foundDeprecated = DEPRECATED_HERDC_CODES.filter(obj => {
                return obj.value.toString(10) === input.toString(10);
            });
            if (foundDeprecated.length > 0) {
                herdcCodes.push(foundDeprecated[0]);
            }
        }
        return herdcCodes;
    };

    return (
        <GenericSelectField
            canUnselect
            itemsList={[..._herdcCodes(preselected)]}
            hideLabel={false}
            locale={{ label: fieldProps.label }}
            selectedValue={
                preselected instanceof Immutable.List
                    ? preselected.toJS()
                    : (!!fieldProps.defaultValue && [fieldProps.defaultValue]) || preselected || []
            }
            onChange={(!!fieldProps.input && fieldProps.input.onChange) || undefined}
            errorText={(!!fieldProps.meta && fieldProps.meta.error) || ''}
            error={(!!fieldProps.meta && !!fieldProps.meta.error) || false}
            {...fieldProps}
        />
    );
}
