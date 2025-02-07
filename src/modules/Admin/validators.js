import { validate } from 'config/admin';

export const validateResolver = data => {
    const errors = validate(data);
    const hasErrors = Object.keys(errors).length > 0;
    const response = {
        values: hasErrors ? {} : data,
        errors: hasErrors ? { ...errors } : {},
    };
    return response;
};
