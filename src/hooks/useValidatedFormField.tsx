import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

/**
 * @param {string} fieldPath. .e.g. 'grants', 'bibliographicSection.rek_title'
 */
export const useValidatedFormField = (fieldPath: string) => {
    const { trigger, getFieldState, formState } = useFormContext();
    // https://react-hook-form.com/docs/useform/getfieldstate
    const hasError = !!getFieldState(fieldPath, formState)?.error?.message?.trim?.();

    useEffect(() => {
        // bail if there is already an error
        if (!fieldPath || hasError) return;

        // otherwise, invoke validation
        (async () => await trigger(fieldPath))();
    }, [trigger, fieldPath, hasError]);

    return { hasError };
};
