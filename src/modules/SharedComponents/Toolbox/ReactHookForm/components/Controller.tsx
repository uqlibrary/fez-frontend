import React from 'react';
import {
    Controller as Base,
    ControllerProps as BaseControllerProps,
    ControllerRenderProps,
    ControllerFieldState,
    UseFormStateReturn,
    FieldValues,
} from 'react-hook-form';
import { get } from 'lodash';

export interface DecoratedField extends Omit<ControllerRenderProps, 'ref'> {
    ref: null;
    state: {
        error: string | undefined;
        defaultValue: unknown;
    };
    [key: string]: unknown;
}

interface ControllerProps extends Omit<BaseControllerProps, 'render'> {
    render: (params: {
        field: DecoratedField;
        fieldState: ControllerFieldState;
        formState: UseFormStateReturn<FieldValues>;
    }) => React.ReactElement;
    state?: { defaultValue?: unknown };
}

/**
 * Decorate the original `field` object with additional attributes required to make
 * RHF's HOC <Controller/> compatible with our custom field components.
 */
const getDecoratedField = (
    field: ControllerRenderProps,
    fieldState: ControllerFieldState,
    formState: UseFormStateReturn<FieldValues>,
): DecoratedField => {
    const decorated = field as unknown as DecoratedField;
    decorated.state = {
        error: fieldState.error?.message,
        defaultValue: get(formState?.defaultValues, field.name),
    };
    decorated.inputRef = field.ref;
    decorated.ref = null;
    return decorated;
};

/**
 * An extended RHF's HoC <Controller> component, with additional props added to `render`s func `field` param,
 * required to make it compatible with the project's custom form field components.
 *
 * Customizations relevant to specific components and cases should be added to a new component that extends
 * this one.
 */
const Controller = ({ render, ...props }: ControllerProps) => (
    <Base
        {...props}
        defaultValue={(props.state?.defaultValue as FieldValues) || ''}
        render={({ field, fieldState, formState }) =>
            render({
                field: getDecoratedField(field, fieldState, formState),
                fieldState,
                formState,
            })
        }
    />
);

export default Controller;
