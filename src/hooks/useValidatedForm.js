import { useLayoutEffect } from 'react';
import { useForm } from './useForm';

export const useValidatedForm = props => {
    const attributes = useForm(props);
    const {
        trigger,
        formState: { isValid, hasValidationError },
    } = attributes;

    // trigger validation prior to rendering in order to display errors (to match redux form behaviour)
    useLayoutEffect(() => {
        if (isValid && !hasValidationError) {
            return;
        }
        (async () => await trigger())();
    }, [isValid, hasValidationError, trigger]);

    return attributes;
};
