import { useLayoutEffect } from 'react';
import { useForm } from './useForm';

/**
 * @param props
 * @return {UseFormReturn<FieldValues, *, undefined>}
 */
export const useValidatedForm = props => {
    const form = useForm(props);
    const {
        trigger,
        formState: { isValid, hasValidationError },
    } = form;

    // trigger validation prior to rendering in order to display errors (to match redux form behaviour)
    useLayoutEffect(() => {
        if (isValid && !hasValidationError) {
            return;
        }
        (async () => await trigger())();
    }, [isValid, hasValidationError, trigger]);

    return form;
};
