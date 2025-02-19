/* eslint-disable no-unused-vars */
import React from 'react';
import { validate } from 'config/admin';
import { useWatch } from 'react-hook-form';
import _, { isMatch } from 'lodash';

export const useFormValidator = form => {
    const data = {
        ...useWatch({
            control: form.control,
        }),
        ...form.getValues(),
    };
    const stateErrors = form.formState.errors;
    const validationErrors = validate(data);
    const errors = { errors: { ...stateErrors, ...validationErrors } };
    return errors;
};
