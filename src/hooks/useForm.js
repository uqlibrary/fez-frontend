import { useForm as useReactHookForm } from 'react-hook-form';
import deepmerge from 'deepmerge';
import { isEmptyObject, filterObjectKeys } from '../helpers/general';

export const SERVER_ERROR_NAMESPACE = 'root';
export const SERVER_ERROR_KEY = 'serverError';

export const setServerError = (setError, e) =>
    setError(`${SERVER_ERROR_NAMESPACE}.${SERVER_ERROR_KEY}`, {
        type: 'custom',
        message: e.message,
        status: e.status,
        original: e.original || e,
    });

export const getServerError = errors => errors[SERVER_ERROR_NAMESPACE]?.[SERVER_ERROR_KEY];

/**
 * Get flatten errors to a `field` => `error` object
 *
 * @param errors
 * @param otherAlreadyFlattenedErrors {{}}
 * @return {*|{}}
 */
export const flattenErrors = (errors, ...otherAlreadyFlattenedErrors) => ({
    ...Object.entries(errors).reduce((acc, [key, { message }]) => ({ ...acc, [key]: message }), {}),
    ...otherAlreadyFlattenedErrors.reduce((acc, error) => ({ ...acc, ...error }), {}),
});

/**
 * @param props
 * @return {UseFormReturn<FieldValues, any, undefined>}
 */
export const useForm = props => {
    const attributes = useReactHookForm({ mode: 'onChange', ...props });

    // add isSubmitFailed attribute to formState
    attributes.formState.isSubmitFailure = attributes.formState.isSubmitted && !attributes.formState.isSubmitSuccessful;
    // add hasError attribute to formState, as isValid alone doesn't seem to take in account raised validation errors
    attributes.formState.hasError = !isEmptyObject(attributes.formState.errors);
    // add hasValidationError attribute to formState - excludes server errors
    attributes.formState.hasValidationError = !isEmptyObject(
        filterObjectKeys(attributes.formState.errors, [SERVER_ERROR_NAMESPACE]),
    );
    // add "server" namespace to formState object for managing server errors
    attributes.formState.server = {
        error: {
            has: !isEmptyObject(
                filterObjectKeys(attributes.formState.errors[SERVER_ERROR_NAMESPACE], [SERVER_ERROR_KEY], true),
            ),
            set: e => setServerError(attributes.setError, e),
            get: () => getServerError(attributes.formState.errors),
            clear: () => attributes.clearErrors(`${SERVER_ERROR_NAMESPACE}.${SERVER_ERROR_KEY}`),
        },
    };

    // RHF defaultValues will ignore any values that are not related to a RHF controlled field.
    // This is a helper function to allow overriding given default values with form's current values.
    attributes.getMergedValues = defaults => deepmerge(defaults, attributes.getValues());

    return attributes;
};
