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
            setError: jest.fn(),
            getValues: jest.fn().mockReturnValue({}),
            clearErrors: jest.fn(),
        };

        jest.spyOn(ReactHookForm, 'useForm').mockReturnValue(mockFormReturn);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const mockServerError = (error = 'server error') =>
        (mockFormReturn.formState.errors = {
            [SERVER_ERROR_NAMESPACE]: {
                [SERVER_ERROR_KEY]: setServerError((_, error) => error, new Error(error)),
            },
        });

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

    describe('formState.server.error', () => {
        it('should set server.error.has to false when there are no server errors', () => {
            const { result } = setup();
            expect(result.current.formState.server.error.has).toBe(false);
        });

        it('should set server.error.has to false when there are no server errors and only validation errors', () => {
            mockFormReturn.formState.errors = { fieldA: { type: 'required' } };

            const { result } = setup();
            expect(result.current.formState.server.error.has).toBe(false);
        });

        it('should set server.error.has to true when there are server errors', () => {
            mockServerError();

            const { result } = setup();
            expect(result.current.formState.server.error.has).toBe(true);
        });

        it('should set server.error with given error', () => {
            const error = {
                message: 'server error',
                status: 500,
                request: { baseUrl: 'api.com' },
            };

            const { result } = setup();
            result.current.formState.server.error.set(error);

            expect(mockFormReturn.setError).toHaveBeenCalledWith(`${SERVER_ERROR_NAMESPACE}.${SERVER_ERROR_KEY}`, {
                message: error.message,
                original: error,
                status: error.status,
                type: 'custom',
            });
        });

        it('should get server.error from formState', () => {
            const serverError = 'Server error';
            mockServerError(serverError);

            const { result } = setup();
            expect(result.current.formState.server.error.get().message).toBe(serverError);
        });

        it('should clear server.error', () => {
            const { result } = setup();

            result.current.formState.server.error.clear();
            expect(mockFormReturn.clearErrors).toHaveBeenCalledWith(`${SERVER_ERROR_NAMESPACE}.${SERVER_ERROR_KEY}`);
        });
    });

    it('getMergedValues should merge form values with given values', () => {
        const extra = { field1: 'defaultValue' };
        mockFormReturn.getValues.mockReturnValue({ field2: 'currentValue' });

        const { result } = setup();
        const mergedValues = result.current.getMergedValues(extra);
        expect(mergedValues).toEqual({ field1: 'defaultValue', field2: 'currentValue' });
    });

    it('flattenErrors should return an object in "field => error" format', () => {
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
});
