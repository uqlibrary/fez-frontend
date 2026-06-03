import { renderHook, waitFor } from 'test-utils';
import { useFormContext } from 'react-hook-form';
import { useValidatedFormField } from './useValidatedFormField';

jest.mock('react-hook-form');

const mockTrigger = jest.fn();
const mockGetFieldState = jest.fn();
const mockFormState = { errors: {} };

const setup = fieldPath => renderHook(({ path }) => useValidatedFormField(path), { initialProps: { path: fieldPath } });

describe('useValidatedFormField', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        useFormContext.mockReturnValue({
            trigger: mockTrigger,
            getFieldState: mockGetFieldState,
            formState: mockFormState,
        });
    });

    describe('validation triggering', () => {
        it('should trigger validation when the field has no error', async () => {
            mockGetFieldState.mockReturnValue({});
            setup('bibliographicSection.rek_title');

            await waitFor(() => {
                expect(mockTrigger).toHaveBeenCalledWith('bibliographicSection.rek_title');
            });
            await waitFor(() => expect(mockTrigger).toHaveBeenCalledTimes(1));
        });

        it('should re-trigger validation when fieldPath changes', async () => {
            mockGetFieldState.mockReturnValue({});
            const { rerender } = setup('grants');

            await waitFor(() => expect(mockTrigger).toHaveBeenCalledWith('grants'));

            rerender({ path: 'bibliographicSection.rek_title' });

            await waitFor(() => expect(mockTrigger).toHaveBeenCalledWith('bibliographicSection.rek_title'));
            expect(mockTrigger).toHaveBeenCalledTimes(2);
        });

        it('should not trigger validation when fieldPath is empty', async () => {
            mockGetFieldState.mockReturnValue({});
            setup('');

            await waitFor(() => expect(mockTrigger).not.toHaveBeenCalled());
        });
    });

    describe('skips validation when field already has an error', () => {
        it('should not trigger when error message is a non-empty string', async () => {
            mockGetFieldState.mockReturnValue({ error: { message: 'Required field' } });
            setup('bibliographicSection.rek_title');

            await waitFor(() => expect(mockTrigger).not.toHaveBeenCalled());
        });

        it('should trigger validation when error message is whitespace only', async () => {
            mockGetFieldState.mockReturnValue({ error: { message: '   ' } });
            setup('bibliographicSection.rek_title');

            await waitFor(() => {
                expect(mockTrigger).toHaveBeenCalledWith('bibliographicSection.rek_title');
            });
        });
    });

    describe('formState subscription', () => {
        it('should pass formState as second arg to getFieldState for reactivity', () => {
            mockGetFieldState.mockReturnValue({});
            setup('bibliographicSection.rek_title');

            expect(mockGetFieldState).toHaveBeenCalledWith('bibliographicSection.rek_title', mockFormState);
        });
    });
});
