import React from 'react';
import { Controller as Base } from 'react-hook-form';

/**
 * Decorate the original `field` object with additional attributes required to make
 * RHF's HOC <Controller/> compatible with our custom field components.
 * @param field object
 * @param fieldState object
 * @return {*}
 */
const getDecoratedField = (field, fieldState, formState) => {
    const decoratedField = field;
    decoratedField.meta = {
        error: fieldState.error?.message,
        // required to make it compatible with ContentIndicatorsField,
        initial: { toJS: () => formState.defaultValues[field.name] },
    };
    // required to make it compatible with SelectFieldWrapper,
    decoratedField.input = decoratedField;
    // to avoid `ref` & forwardRef() errors
    decoratedField.ref = null; // TODO make it conditional if required
    return decoratedField;
};

// eslint-disable-next-line react/prop-types
const Controller = ({ render, ...props }) => {
    return (
        <Base
            {...props}
            // required to avoid "A component is changing an uncontrolled input to be controlled" warnings
            /* eslint-disable-next-line react/prop-types */
            defaultValue={props.defaultValue || ''}
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
