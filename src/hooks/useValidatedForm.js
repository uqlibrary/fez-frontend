import { useForm } from 'react-hook-form';
import { useLayoutEffect } from 'react';

export const useValidatedForm = props => {
    const attributes = useForm(props);
    const {
        trigger,
        formState: { isValid, errors },
    } = attributes;

    const hasErrors = Object.keys(errors).length > 0;
    // trigger validation prior to rendering in order to display errors (to match redux form behaviour)
    useLayoutEffect(() => {
        if (isValid && !hasErrors) {
            return;
        }
        (async () => await trigger())();
    }, [isValid, hasErrors, trigger]);

    return attributes;
};
