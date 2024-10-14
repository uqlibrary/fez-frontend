import { useLayoutEffect } from 'react';
import { useForm } from './useForm';

export const useValidatedForm = props => {
    const attributes = useForm(props);
    const {
        trigger,
        formState: { isValid, hasErrors },
    } = attributes;

    // trigger validation prior to rendering in order to display errors (to match redux form behaviour)
    useLayoutEffect(() => {
        if (isValid && !hasErrors) {
            return;
        }
        (async () => await trigger())();
    }, [isValid, hasErrors, trigger]);

    return attributes;
};
