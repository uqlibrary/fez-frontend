/* eslint-disable react/prop-types */
import { useWatch } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { validate } from 'config/admin';
import debounce from 'lodash/debounce';

export const FormValidator = ({ form, setCustomErrors }) => {
    // 2. Watch all form values
    const watchedValues = useWatch({
        control: form.control,
    });

    // 3. Create debounced validation function
    const debouncedValidate = useMemo(
        () =>
            debounce(data => {
                const validationResult = validate(data);
                setCustomErrors(validationResult);
            }, 200),
        [setCustomErrors],
    );

    // 4. Handle form value changes with typing detection
    useEffect(() => {
        debouncedValidate({ ...watchedValues, ...form.getValues() });

        return () => {
            debouncedValidate.cancel();
        };
    }, [debouncedValidate, form, watchedValues]);

    // 5. Render nothing
    return null;
};
