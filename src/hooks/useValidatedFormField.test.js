import { renderHook, waitFor } from 'test-utils';
import { useFormContext } from 'react-hook-form';
import { useValidatedFormField } from './useValidatedFormField';

jest.mock('react-hook-form');

const mockTrigger = jest.fn();
const mockGetFieldState = jest.fn();

const setup = fieldPath => renderHook(() => useValidatedFormField(fieldPath));

describe('useValidatedFormField', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        useFormContext.mockReturnValue({
            trigger: mockTrigger,
            getFieldState: mockGetFieldState,
        });
    });

    it('triggers validation when the field has no error', async () => {
        mockGetFieldState.mockReturnValue({});
        setup('bibliographicSection.rek_title');

        await waitFor(() => {
            expect(mockTrigger).toHaveBeenCalledWith('bibliographicSection.rek_title');
        });
    });

    it('does not trigger validation when the field already has an error', async () => {
        mockGetFieldState.mockReturnValue({
            error: { message: 'Required field' },
        });
        setup('bibliographicSection.rek_title');

        await waitFor(() => {
            expect(mockTrigger).not.toHaveBeenCalled();
        });
    });

    it('does not trigger validation when fieldPath is empty', async () => {
        mockGetFieldState.mockReturnValue({});
        setup('');

        await waitFor(() => {
            expect(mockTrigger).not.toHaveBeenCalled();
        });
    });
});
