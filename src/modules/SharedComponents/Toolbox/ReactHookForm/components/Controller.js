import React from 'react';
import { Controller as Base } from 'react-hook-form';

/**
 * Decorate the original `field` object with additional attributes required to make
 * RHF's HOC <Controller/> compatible with our custom field components.
 * @param {object} field
 * @param {object} fieldState
 * @param {object} formState
 * @return {object}
 */
const getDecoratedField = (field, fieldState, formState) => {
    // expose state required only props to minimize memory consumption and unexpected props warnings
    field.state = {
        error: fieldState.error?.message,
        defaultValue: formState?.defaultValues?.[field.name],
    };
    // to avoid `ref` & forwardRef() errors
    field.ref = null;

    return field;
};

// eslint-disable-next-line react/prop-types
const Controller = ({ render, ...props }) => {
    return (
        <Base
            {...props}
            // required to avoid "A component is changing an uncontrolled input to be controlled" warnings
            /* eslint-disable-next-line react/prop-types */
            defaultValue={props.state?.defaultValue || ''}
            render={({ field, fieldState, formState }) =>
                render({
                    field: getDecoratedField(field, fieldState, formState),
                    fieldState,
                    formState,
                })
            }
        />
    );
};

export default Controller;
