import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

/**
 * @param {string} fieldPath
 */
export const useValidatedFormField = fieldPath => {
    const { trigger, getFieldState } = useFormContext();
    const hasError = !!getFieldState(fieldPath)?.error?.message?.trim?.();

    useEffect(() => {
        // bail if there are already errors
        if (!fieldPath || hasError) return;

        // invoke validation on field render
        (async () => await trigger(fieldPath))();
    }, [trigger, hasError]);
};
