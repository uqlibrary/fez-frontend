import { validate } from 'config/journalAdmin';

export const validateResolver = async data => {
    const errors = validate(data);
    const hasErrors = Object.keys(errors).length > 0;
    return {
        values: hasErrors ? {} : data,
        errors: hasErrors ? { ...errors } : {},
    };
};
