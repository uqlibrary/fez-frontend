import { validate } from 'config/admin';
import { useWatch } from 'react-hook-form';
import { merge } from 'lodash';

export const useFormValidator = form => {
    const data = {
        ...useWatch({
            control: form.control,
        }),
        ...form.getValues(),
    };
    const formErrors = form.formState.errors;
    const validationErrors = validate(data);
    const errors = { errors: merge(validationErrors, formErrors) };
    return errors;
};
