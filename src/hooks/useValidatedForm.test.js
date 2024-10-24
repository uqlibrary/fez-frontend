import { renderHook } from 'test-utils';
import { useValidatedForm } from './useValidatedForm';

const mockTrigger = jest.fn();

const setup = () => renderHook(() => useValidatedForm());
describe('useValidatedForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call trigger when there are validation errors', () => {
        jest.spyOn(require('./useForm'), 'useForm').mockReturnValue({
            trigger: mockTrigger,
            formState: {
                isValid: false,
                hasValidationError: true,
            },
        });

        setup();
        expect(mockTrigger).toHaveBeenCalled();
    });

    it('should not call trigger when is valid', () => {
        jest.spyOn(require('./useForm'), 'useForm').mockReturnValue({
            trigger: mockTrigger,
            formState: {
                isValid: true,
                hasValidationError: false,
            },
        });

        setup();
        expect(mockTrigger).not.toHaveBeenCalled();
    });

    it('should call trigger when hasValidationError changes', () => {
        const useFormSpy = jest.spyOn(require('./useForm'), 'useForm').mockReturnValue({
            trigger: mockTrigger,
            formState: {
                isValid: true,
                hasValidationError: false,
            },
        });

        const { rerender } = setup();
        expect(mockTrigger).not.toHaveBeenCalled();

        // simulate state change
        useFormSpy.mockReturnValue({
            trigger: mockTrigger,
            formState: {
                isValid: false,
                hasValidationError: true,
            },
        });

        rerender();
        expect(mockTrigger).toHaveBeenCalled();
    });
});
