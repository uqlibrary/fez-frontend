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
    const decoratedField = field;
    const input = {
        ...field,
        meta: {
            error: fieldState.error?.message,
            // required to make it compatible with ContentIndicatorsField,
            initial: { toJS: () => formState.defaultValues[field.name] },
            form: Object.keys(formState).length > 0 && 'hasForm', // TODO - remove after reduxForm migration
        },
        ref: null,
        value: decoratedField.value || '',
    };
    // required to make it compatible with SelectFieldWrapper,
    decoratedField.input = input;
    decoratedField.meta = input.meta;
    // to avoid `ref` & forwardRef() errors
    decoratedField.ref = input.ref; // TODO make it conditional if required
    // required to avoid "A component is changing an uncontrolled input to be controlled" warnings
    decoratedField.value = input.value;

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
