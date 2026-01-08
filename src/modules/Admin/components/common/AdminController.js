import React from 'react';
import { get } from 'lodash';

import { Controller as Base } from 'modules/SharedComponents/Toolbox/ReactHookForm';

/**
 * Extend custom Controller to handle default values for Admin pages.
 *
 * @param {function} render
 * @param {object} props
 * @return {Element}
 * @constructor
 */
// eslint-disable-next-line react/prop-types
const Controller = ({ render, ...props }) => {
    return (
        <Base
            {...props}
            render={({ field, fieldState, formState }) => {
                // Get the default value from formState.defaultValues using the field name path
                const defaultValue = get(formState?.defaultValues, field.name);
                // If field value is undefined/null/empty and we have a defaultValue, use it
                // This handles the case where initial RHF form data changes after form has initialised
                if (field.value === undefined && defaultValue !== undefined) {
                    field.value = defaultValue;
                }
                return render({
                    field,
                    fieldState,
                    formState,
                });
            }}
        />
    );
};

export default Controller;
