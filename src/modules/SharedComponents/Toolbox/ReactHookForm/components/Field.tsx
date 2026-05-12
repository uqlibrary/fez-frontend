import React from 'react';
import { Control, FieldValues } from 'react-hook-form';
import Controller, { DecoratedField } from './Controller';

type Validator = (
    value: unknown,
    formValues: FieldValues,
) => Promise<string | null | undefined> | string | null | undefined;

export interface FieldProps {
    name: string;
    control: Control;
    rules?: Record<string, unknown>;
    component: React.ComponentType<DecoratedField & Record<string, unknown>>;
    validate?: Validator[];
    normalize?: (value: unknown) => unknown;
    controller?: React.ComponentType<React.ComponentProps<typeof Controller>>;
    [key: string]: unknown;
}

/**
 * Validate handler that validates a value against a list of validators.
 * It returns the first error message, if any
 */
export const validateHandler = async (
    value: unknown,
    formValues: FieldValues,
    validators: Validator[],
): Promise<string | undefined> => {
    if (!Array.isArray(validators)) return undefined;

    for (const validator of validators) {
        if (typeof validator !== 'function') continue;
        let result = await Promise.resolve(validator(value, formValues));
        if (typeof result !== 'string') continue;
        result = result.trim();
        if (result.length > 0) return result;
    }
    return undefined;
};

/**
 * A simple Higher-Order Component (HoC) inspired by the Redux Form <Field> component. It utilizes a custom HoC based
 * on the React Hook Form <Controller> component.
 *
 * Customizations relevant to specific components and cases should be added to a new component that extends
 * this one.
 *
 * Props notes:
 * - validate: an array of validators that are checks the field's value sequentially, in left-to-right order.
 * - normalize: function that gets called on every field's value change event.
 */
const Field = ({
    name,
    control,
    rules,
    component: Component,
    validate,
    normalize,
    controller: ControllerComponent = Controller,
    ...childProps
}: FieldProps) => (
    <ControllerComponent
        name={name}
        control={control}
        rules={{
            ...rules,
            validate: /* istanbul ignore next */ (value: unknown, formValues: FieldValues) =>
                validateHandler(value, formValues, validate ?? []),
        }}
        render={({ field }) => {
            if (typeof field.onChange === 'function' && typeof normalize === 'function') {
                const originalOnChange = field.onChange;
                field.onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                    originalOnChange(normalize(event?.target ? event.target.value : event) as never);
                };
            }
            return <Component {...childProps} {...field} />;
        }}
    />
);

export default Field;
