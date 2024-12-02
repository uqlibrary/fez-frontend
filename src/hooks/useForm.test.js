import { renderHook } from 'test-utils';
import * as ReactHookForm from 'react-hook-form';
import { useForm, SERVER_ERROR_NAMESPACE, SERVER_ERROR_KEY, setServerError, flattenErrors } from './useForm';

const setup = props => renderHook(() => useForm(props));

describe('useForm hook', () => {
    let mockFormReturn;

    beforeEach(() => {
        mockFormReturn = {
            formState: {
                errors: {},
                isSubmitted: false,
                isSubmitSuccessful: false,
            },
            values: {},
            setError: jest.fn(),
            clearErrors: jest.fn(),
        };
        mockFormReturn.getValues = jest.fn().mockImplementation(() => mockFormReturn.values);
        mockFormReturn.handleSubmit = jest
            .fn()
            .mockImplementation(callback => () => callback(mockFormReturn.getValues()));

        jest.spyOn(ReactHookForm, 'useForm').mockReturnValue(mockFormReturn);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const mockServerError = (error = 'server error') =>
        setServerError((path, error) => {
            const [namespace, key] = path.split('.');
            mockFormReturn.formState.errors = {
                [namespace]: {
                    [key]: error,
                },
            };
        }, new Error(error));

    it('should call original useForm() with default mode="onChange"', () => {
        const props = { defaultValues: { field1: 'value1' } };

        setup(props);
        expect(ReactHookForm.useForm).toHaveBeenCalledWith({ mode: 'onChange', ...props });
    });

    it('should call original useForm() with "mode" override', () => {
        const props = { mode: 'all', defaultValues: { field1: 'value1' } };

        setup(props);
        expect(ReactHookForm.useForm).toHaveBeenCalledWith(props);
    });

    it('should set formState.isSubmitFailure to true when the form is not successfully submitted', () => {
        mockFormReturn.formState.isSubmitted = true;
        mockFormReturn.formState.isSubmitSuccessful = false;

        const { result } = setup();
        expect(result.current.formState.isSubmitFailure).toBe(true);
    });

    it('should set formState.isSubmitFailure to false when the form is successfully submitted', () => {
        mockFormReturn.formState.isSubmitted = true;
        mockFormReturn.formState.isSubmitSuccessful = true;

        const { result } = setup();
        expect(result.current.formState.isSubmitFailure).toBe(false);
    });

    describe('formState.hasError ', () => {
        it('should set hasError to false when there are no errors', () => {
            const { result } = setup();
            expect(result.current.formState.hasError).toBe(false);
        });

        it('should set hasError to true when there are validation errors', () => {
            mockFormReturn.formState.errors = { fieldA: { type: 'required' } };

            const { result } = setup();
            expect(result.current.formState.hasError).toBe(true);
        });

        it('should set hasError to true when there are server errors', () => {
            mockServerError();

            const { result } = setup();
            expect(result.current.formState.hasError).toBe(true);
        });

        it('should set hasError to true when there are validation and server errors', () => {
            mockServerError();
            mockFormReturn.formState.errors.fieldA = { type: 'required' };

            const { result } = setup();
            expect(result.current.formState.hasError).toBe(true);
        });
    });

    describe('formState.hasValidationError ', () => {
        it('should set hasValidationError to false when there are no validation errors', () => {
            const { result } = setup();

            expect(result.current.formState.hasValidationError).toBe(false);
        });

        it('should set hasValidationError to false when there are no validation errors, but server errors', () => {
            mockServerError();

            const { result } = setup();
            expect(result.current.formState.hasValidationError).toBe(false);
        });

        it('should set hasValidationError to true when there are validation errors', () => {
            mockFormReturn.formState.errors = {
                fieldA: { type: 'required' },
            };

            const { result } = setup();
            expect(result.current.formState.hasValidationError).toBe(true);
        });

        it('should set hasValidationError to true when there are validation and server error', () => {
            mockServerError();
            mockFormReturn.formState.errors.fieldA = { type: 'required' };

            const { result } = setup();
            expect(result.current.formState.hasValidationError).toBe(true);
        });
    });

    describe('formState server error', () => {
        it('should set hasServerError to false when there are no server errors', () => {
            const { result } = setup();
            expect(result.current.formState.hasServerError).toBe(false);
        });

        it('should set hasServerError to false when there are no server errors and only validation errors', () => {
            mockFormReturn.formState.errors = { fieldA: { type: 'required' } };

            const { result } = setup();
            expect(result.current.formState.hasServerError).toBe(false);
        });

        it('should set hasServerError to true when there are server errors', () => {
            mockServerError();

            const { result } = setup();
            expect(result.current.formState.hasServerError).toBe(true);
        });

        it('should set server error with setServerError', () => {
            const error = {
                message: 'server error',
                status: 500,
                request: { baseUrl: 'api.com' },
            };

            const { result } = setup();
            expect(result.current.formState.serverError).toEqual(undefined);
            result.current.setServerError(error);

            expect(mockFormReturn.setError).toHaveBeenCalledWith(`${SERVER_ERROR_NAMESPACE}.${SERVER_ERROR_KEY}`, {
                message: error.message,
                original: error,
                status: error.status,
                type: 'custom',
            });
        });

        it('should expose server error as formState.serverError', () => {
            const serverError = 'Server error';
            mockServerError(serverError);

            const { result } = setup();
            expect(result.current.formState.serverError.message).toBe(serverError);
        });

        it('should expose resetServerError to clear server error', () => {
            const { result } = setup();

            result.current.resetServerError();
            expect(mockFormReturn.clearErrors).toHaveBeenCalledWith(`${SERVER_ERROR_NAMESPACE}.${SERVER_ERROR_KEY}`);
        });
    });

    it('mergeWithFormValues should merge form values with given values', () => {
        const extra = { field1: 'defaultValue' };
        const files = {
            queue: [
                new File([new Blob(['Hello World'], { type: 'text/plain' })], 'example.txt', {
                    type: 'text/plain',
                }),
            ],
            isValid: true,
        };
        mockFormReturn.getValues.mockReturnValue({
            field2: 'currentValue',
            files,
        });

        const { result } = setup();
        const mergedValues = result.current.mergeWithFormValues(extra);
        expect(mergedValues).toEqual({ field1: 'defaultValue', field2: 'currentValue', files });
    });

    describe('flattenErrors', () => {
        it('flattenErrors should return an object in "field => error" format', () => {
            mockFormReturn.formState.errors = {
                fieldA: { type: 'required', message: 'field is required' },
                fieldB: { type: 'maxLength', message: 'field should not have more...' },
            };

            const { result } = setup();
            expect(flattenErrors(result.current.formState.errors)).toEqual({
                fieldA: 'field is required',
                fieldB: 'field should not have more...',
            });
        });

        it('flattenErrors should return an object in "field => error" format with additional errors given', () => {
            mockFormReturn.formState.errors = {
                fieldA: { type: 'required', message: 'field is required' },
                fieldB: { type: 'maxLength', message: 'field should not have more...' },
            };

            const formLevelErrorA = { formLevelErrorA: 'form is invalid' };
            const formLevelErrorB = { formLevelErrorB: 'form is has to be fixed' };

            const { result } = setup();
            expect(flattenErrors(result.current.formState.errors, formLevelErrorA, formLevelErrorB)).toEqual({
                fieldA: 'field is required',
                fieldB: 'field should not have more...',
                formLevelErrorA: 'form is invalid',
                formLevelErrorB: 'form is has to be fixed',
            });
        });

        it('flattenErrors should return an object in "field => error" format when form errors are empty and additional errors are given', () => {
            const formLevelErrorA = { formLevelErrorA: 'form is invalid' };
            const formLevelErrorB = { formLevelErrorB: 'form is has to be fixed' };

            expect(flattenErrors({}, formLevelErrorA, formLevelErrorB)).toEqual({
                formLevelErrorA: 'form is invalid',
                formLevelErrorB: 'form is has to be fixed',
            });
        });

        it('flattenErrors should return an empty object when no errors are given', () => {
            const formLevelErrorA = {};

            expect(flattenErrors(null, formLevelErrorA, false)).toEqual({});
        });
    });

    describe('getAlertErrorProps', () => {
        it('getAlertErrorProps should return empty object if no errors', () => {
            const { result } = setup();
            expect(result.current.getAlertErrorProps()).toEqual({});
        });

        it('getAlertErrorProps should return server error if any', () => {
            const serverError = 'Server error';
            mockServerError(serverError);

            const { result } = setup();
            expect(result.current.getAlertErrorProps()).toEqual({
                error: serverError,
            });
        });

        it('getAlertErrorProps should return server error only when there are validation errors too', () => {
            const serverError = 'Server error';
            mockServerError(serverError);
            mockFormReturn.formState.errors.fieldA = { message: 'required' };

            const { result } = setup();
            expect(result.current.getAlertErrorProps()).toEqual({
                error: serverError,
            });
        });

        it('getAlertErrorProps should return validation errors', () => {
            mockFormReturn.formState.errors.fieldA = { message: 'required' };

            const { result } = setup();
            expect(result.current.getAlertErrorProps()).toEqual({
                formErrors: { fieldA: 'required' },
            });
        });

        it('getAlertErrorProps should return validation errors with additional errors', () => {
            mockFormReturn.formState.errors.fieldA = { message: 'required' };
            const formLevelErrorA = { formLevelErrorA: 'form is invalid' };
            const formLevelErrorB = { formLevelErrorB: 'form needs fixing' };

            const { result } = setup();
            expect(result.current.getAlertErrorProps(formLevelErrorA, formLevelErrorB)).toEqual({
                formErrors: {
                    fieldA: 'required',
                    formLevelErrorA: 'form is invalid',
                    formLevelErrorB: 'form needs fixing',
                },
            });
        });

        it('getAlertErrorProps should return additional errors regardless of validation errors', () => {
            const formLevelErrorA = { formLevelErrorA: 'form is invalid' };
            const formLevelErrorB = { formLevelErrorB: 'form needs fixing' };

            const { result } = setup();
            expect(result.current.getAlertErrorProps(formLevelErrorA, formLevelErrorB)).toEqual({
                formErrors: { formLevelErrorA: 'form is invalid', formLevelErrorB: 'form needs fixing' },
            });
        });

        it('getAlertErrorProps should return validation errors in the correct order using defaultValues, ignoring some validation errors', () => {
            mockFormReturn.formState.errors = {
                fieldB: { message: 'required' },
                fieldA: { message: 'required' },
                fieldC: { message: 'required' }, // this will be ignored as is not defined in defaultValues or values
            };
            mockFormReturn.formState.defaultValues = { fieldA: '', fieldB: '' };

            const { result } = setup();
            expect(result.current.getAlertErrorProps()).toEqual({
                formErrors: { fieldA: 'required', fieldB: 'required' },
            });
        });

        it('getAlertErrorProps should return validation errors in the correct order using values with additional errors', () => {
            mockFormReturn.formState.errors = {
                fieldB: { message: 'required' },
                fieldA: { message: 'required' },
                fieldC: { message: 'required' }, // this will be ignored as is not defined in defaultValues or values
            };
            mockFormReturn.formState.values = { fieldA: '', fieldB: '' };

            const formLevelErrorA = { formLevelErrorA: 'form is invalid' };
            const formLevelErrorB = { formLevelErrorB: 'form needs fixing' };

            const { result } = setup();
            expect(result.current.getAlertErrorProps(formLevelErrorA, formLevelErrorB)).toEqual({
                formErrors: {
                    fieldA: 'required',
                    fieldB: 'required',
                    formLevelErrorA: 'form is invalid',
                    formLevelErrorB: 'form needs fixing',
                },
            });
        });
    });

    describe('safelyHandleSubmit', () => {
        it('safelyHandleSubmit should execute given callback with form values', async () => {
            mockFormReturn.values = { field: 'value' };
            const fn = jest.fn().mockResolvedValue(undefined);
            const { result } = setup();

            const onSubmit = result.current.safelyHandleSubmit(fn);
            // mimic form submission
            await onSubmit();

            expect(mockFormReturn.handleSubmit).toHaveBeenCalled();
            expect(mockFormReturn.setError).not.toHaveBeenCalled();
            expect(fn).toHaveBeenCalledWith({ field: 'value' });
        });

        it('safelyHandleSubmit should catch error when executing given callback as set it as a server error', async () => {
            const error = new Error('server error');
            mockFormReturn.values = { field: 'value' };
            const fn = jest.fn().mockRejectedValue(error);
            const { result } = setup();

            const onSubmit = result.current.safelyHandleSubmit(fn);
            // mimic form submission
            await onSubmit();

            expect(mockFormReturn.handleSubmit).toHaveBeenCalled();
            expect(mockFormReturn.setError).toHaveBeenCalledWith(`${SERVER_ERROR_NAMESPACE}.${SERVER_ERROR_KEY}`, {
                message: error.message,
                original: error,
                type: 'custom',
            });
            expect(fn).toHaveBeenCalledWith({ field: 'value' });
        });
    });
});
