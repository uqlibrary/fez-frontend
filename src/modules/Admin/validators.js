import { useMemo } from 'react';
import { merge } from 'lodash';

// This hook is now extremely cheap. Its only job is to merge two different error objects.
export const useFormValidator = (formErrors, customErrors) => {
    const errors = useMemo(() => {
        return { errors: merge({}, formErrors, customErrors) };
    }, [customErrors, formErrors]);

    return errors;
};
