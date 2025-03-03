import { useForm as useReactHookForm } from 'react-hook-form';
import {
    isEmptyObject,
    filterObjectKeys,
    reorderObjectKeys,
    combineObjects,
    isDevEnv,
    isFezRecordOneToOneRelation,
    isFezRecordOneToManyRelation,
} from '../helpers/general';
import arrayDiff from 'locutus/php/array/array_diff';
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
 * Flatten errors to a `field` => `error` object.
 * @param errors
 * @param otherFlattenedErrorList
 * @return {{[p: string]: *}}
 */
export const flattenErrors = (errors, ...otherFlattenedErrorList) => {
    return {
        ...(errors && typeof errors === 'object'
            ? Object.entries(errors).reduce((acc, [key, { message }]) => {
                  // recurse and merge errors
                  if (isFezRecordOneToOneRelation(errors, key)) {
                      return { ...acc, ...flattenErrors(errors[key]) };
                  }
                  // recurse and store the first error under the relation name, not the field name
                  if (isFezRecordOneToManyRelation(errors, key)) {
                      const nestedError = flattenErrors(errors[key][0]);
                      return { ...acc, [key]: Object.values(nestedError)[0] };
                  }
                  return { ...acc, [key]: message };
              }, {})
            : {}),
        ...combineObjects(...otherFlattenedErrorList),
    };
};

/**
 * @param fields
 * @return {string[]}
 */
export const flattenFormFieldKeys = fields => {
    return fields && typeof fields === 'object'
        ? Object.entries(fields).reduce((acc, [key]) => {
              // recurse and merge keys
              if (isFezRecordOneToOneRelation(fields, key)) {
                  return [...acc, ...flattenFormFieldKeys(fields[key])];
              }
              return [...acc, key];
          }, [])
        : [];
};

/**
 * Create a handle submit handler that handles server errors if any
 * @param attributes
 * @return {function(*): *}
 */
const safelyHandleSubmit = attributes => callback =>
    attributes.handleSubmit(async (data, event) => {
        try {
            event?.preventDefault();
            await callback(data);
        } catch (e) {
            attributes.setServerError(e);
        }
    });

/**
 * @param diff
 * @return string
 */
export const getPropsForAlertInconsistencyWarning = diff =>
    `useForm() :: some invalid form fields could not be added to the generated formErrors object.\n' + 
    'Make sure to add the following fields to \`defaultValues\` or \`values\` props:\n${JSON.stringify(diff, null, 2)}`;

/**
 * @param attributes
 * @return {(function(...[*]): ({submitting: *, submitSucceeded: *, error: *}))|*}
 */
const getPropsForAlert = attributes => (...additionalValidationErrors) => {
    const props = {
        submitting: !!attributes.formState.isSubmitting,
        submitSucceeded: !!attributes.formState.isSubmitSuccessful,
    };

    if (attributes.formState.hasServerError) {
        return {
            ...props,
            error: attributes.formState.serverError?.message,
        };
    }

    if (!attributes.formState.hasValidationError && !additionalValidationErrors.length) {
        return props;
    }

    // if `values` or `formState.defaultValues` props are set, its keys are used for ordering returned
    // formErrors object.
    // Note: when using theses props, they must include all forms fields in the desired order.
    // Otherwise, the missing fields will not be present in the formErrors object. Unfortunately,
    // with the current RHF implementation, this is not possible to solved programmatically.
    const formFields = flattenFormFieldKeys(
        attributes.values && !!Object.keys(attributes.values).length
            ? attributes.values
            : attributes.formState?.defaultValues,
    );

    if (formFields.length) {
        const { validationErrors } = attributes.formState;
        const orderedErrors = reorderObjectKeys(flattenErrors(validationErrors), formFields);

        const validationErrorsKeys = Object.keys(validationErrors);
        const orderedErrorsKeys = Object.keys(orderedErrors);
        // warn devs in case not all errors are present in the ordered errors object
        if (isDevEnv() && validationErrorsKeys.length !== orderedErrorsKeys.length) {
            const result = Object.values(arrayDiff(validationErrorsKeys, orderedErrorsKeys));
            console.error(getPropsForAlertInconsistencyWarning(result));
        }

        return {
            ...props,
            formErrors: {
                ...orderedErrors,
                ...combineObjects(...additionalValidationErrors),
            },
        };
    }

    return {
        ...props,
        formErrors: flattenErrors(attributes.formState.validationErrors, ...additionalValidationErrors),
    };
};

/**
 * @param props
 * @return {UseFormReturn<FieldValues, any, undefined>}
 */
export const useForm = (props = {}) => {
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
    attributes.mergeWithFormValues = (defaults, filter) =>
        merge(defaults, typeof filter === 'function' ? filter(attributes.getValues()) : attributes.getValues());

    // alert component helpers
    attributes.getPropsForAlert = getPropsForAlert(attributes);

    return attributes;
};
