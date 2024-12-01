import { useForm as useReactHookForm } from 'react-hook-form';
import { isEmptyObject, filterObjectKeys, reorderObjectKeys, combineObjects } from '../helpers/general';
import { merge } from 'lodash';

export const SERVER_ERROR_NAMESPACE = 'root';
export const SERVER_ERROR_KEY = 'serverError';

/**
 * @param setError
 * @param e
 */
export const setServerError = (setError, e) => {
    setError(`${SERVER_ERROR_NAMESPACE}.${SERVER_ERROR_KEY}`, {
        type: 'custom',
        message: e.message,
        status: e.status,
        original: e.original || e,
    });
};

/**
 * @param errors
 * @return {*}
 */
const getServerError = errors => errors[SERVER_ERROR_NAMESPACE]?.[SERVER_ERROR_KEY];

/**
 * Get flatten errors to a `field` => `error` object
 * @param errors
 * @param otherFlattenedErrorList
 * @return {{[p: string]: *}}
 */
export const flattenErrors = (errors, ...otherFlattenedErrorList) => {
    return {
        ...(errors && typeof errors === 'object'
            ? Object.entries(errors).reduce((acc, [key, { message }]) => ({ ...acc, [key]: message }), {})
            : {}),
        ...combineObjects(...otherFlattenedErrorList),
    };
};

/**
 * Create a handle submit handler that handles server errors if any
 * @param attributes
 * @return {function(*): *}
 */
const safelyHandleSubmit = attributes => callback =>
    attributes.handleSubmit(async data => {
        try {
            await callback(data);
        } catch (e) {
            attributes.setServerError(e);
        }
    });

/**
 * @param attributes
 * @return {(function(...[*]): ({error: *}))|*}
 */
const getAlertErrorProps = attributes => (...additionalValidationErrors) => {
    if (attributes.formState.hasServerError) {
        return {
            error: attributes.formState.serverError?.message,
        };
    }

    if (!attributes.formState.hasValidationError && !additionalValidationErrors.length) {
        return {};
    }

    // if defaultValues or values props are set, its keys will be used to order the returned error object below
    // Note: any fields that are not defined in those props when they are defined, will not be added to the ordered
    // error object - to fix this, make sure to add all forms fields to defaultValues or values props
    const errorKeyOrder = Object.keys(attributes.formState.defaultValues || attributes.formState.values || {});
    return {
        formErrors: {
            // order errors if possible
            ...(!!errorKeyOrder.length
                ? {
                      ...reorderObjectKeys(flattenErrors(attributes.formState.validationErrors), errorKeyOrder),
                      ...combineObjects(...additionalValidationErrors),
                  }
                : flattenErrors(attributes.formState.validationErrors, ...additionalValidationErrors)),
        },
    };
};

/**
 * @param props
 * @return {UseFormReturn<FieldValues, any, undefined>}
 */
export const useForm = props => {
    const attributes = useReactHookForm({ mode: 'onChange', ...props });

    // add additional errors related attributes
    attributes.formState.isSubmitFailure = attributes.formState.isSubmitted && !attributes.formState.isSubmitSuccessful;
    attributes.formState.hasError = !isEmptyObject(attributes.formState.errors);
    attributes.formState.validationErrors = filterObjectKeys(attributes.formState.errors, [SERVER_ERROR_NAMESPACE]);
    attributes.formState.hasValidationError = !isEmptyObject(attributes.formState.validationErrors);

    // add server error related attributes & helpers
    attributes.formState.hasServerError = !isEmptyObject(
        filterObjectKeys(attributes.formState.errors[SERVER_ERROR_NAMESPACE], [SERVER_ERROR_KEY], true),
    );
    attributes.formState.serverError = getServerError(attributes.formState.errors);
    attributes.setServerError = e => setServerError(attributes.setError, e);
    attributes.resetServerError = () => attributes.clearErrors(`${SERVER_ERROR_NAMESPACE}.${SERVER_ERROR_KEY}`);

    // form submission helpers
    attributes.safelyHandleSubmit = safelyHandleSubmit(attributes);
    // RHF defaultValues will ignore any values that are not related to a RHF controlled field.
    // This is a helper function to allow overriding given default values with form's current values.
    attributes.mergeWithFormValues = defaults => merge(defaults, attributes.getValues());

    // alert component helpers
    attributes.getAlertErrorProps = getAlertErrorProps(attributes);

    return attributes;
};
