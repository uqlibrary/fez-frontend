import React from 'react';
import PropTypes from 'prop-types';
import Controller from './Controller';

/**
 * Validate handler that validates a value against a list of validators.
 * It returns the first error message, if any
 *
 * @param value
 * @param validate
 * @return {string|null}
 */
export const validateHandler = async (value, formValues, validators) => {
    if (!(validators instanceof Array)) {
        return null;
    }

    for (const validator of validators) {
        if (typeof validator !== 'function') continue;

        let result = await Promise.resolve(validator(value, formValues));

        if (typeof result !== 'string') {
            continue;
        }

        result = result.trim();
        if (result.length > 0) {
            return result;
        }
    }

    return null;
};

/**
 * A Higher-Order Component (HoC) inspired by the Redux Form <Field> component.
 * It utilizes a custom HoC based on the React Hook Form <Controller> component.
 *
 * Props notes:
 * - validate: an array of validators that are checks the field's value sequentially, in left-to-right order.
 * - normalize: function that gets called on every field's value change event.
 *
 * @param {string} name
 * @param {object} control
 * @param {*} rules
 * @param {function} Component
 * @param {[function]} validate
 * @param {function} normalize
 * @param {*} childProps
 * @return {Element}
 * @constructor
 */
const Field = ({ name, control, rules, component: Component, validate, normalize, ...childProps }) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={{
                ...rules,
                validate: /* istanbul ignore next */ (value, formValues) =>
                    validateHandler(value, formValues, validate),
            }}
            render={({ field }) => {
                if (typeof field.onChange === 'function' && typeof normalize === 'function') {
                    const originalOnChange = field.onChange;
                    field.onChange = event => {
                        originalOnChange(normalize(event && event?.target ? event.target.value : event));
                    };
                }
                return <Component {...childProps} {...field} />;
            }}
        />
    );
};

Field.propTypes = {
    name: PropTypes.string.isRequired,
    control: PropTypes.object.isRequired,
    rules: PropTypes.object,
    validate: PropTypes.array,
    component: PropTypes.elementType.isRequired,
    normalize: PropTypes.func,
};

export default Field;
