import React from 'react';
import { render, userEvent, FormProviderWrapper, act } from 'test-utils';

import SensitiveHandlingNoteField from './SensitiveHandlingNoteField';

function setup(testProps = {}, renderer = render) {
    const props = {
        ...testProps,
    };

    return renderer(
        <FormProviderWrapper>
            <SensitiveHandlingNoteField {...props} />
        </FormProviderWrapper>,
    );
}

describe('SensitiveHandlingNoteField', () => {
    it('should render default view', async () => {
        const { getByTestId, getByRole, getAllByRole } = setup({});
        expect(getByTestId('rek-sensitive-handling-note-id-input')).not.toHaveAttribute('disabled');
        await userEvent.click(getByTestId('rek-sensitive-handling-note-id-select'));
        expect(getByRole('presentation')).toBeInTheDocument();
        expect(getAllByRole('option').length).toBe(8);
    });

    it('should render other view', async () => {
        const { getByTestId, getByRole } = setup({});
        await userEvent.click(getByTestId('rek-sensitive-handling-note-id-select'));

        await userEvent.click(getByRole('option', { name: 'Other' }));

        expect(getByTestId('rek-sensitive-handling-note-other')).toBeInTheDocument();

        await expect(getByTestId('rek-sensitive-handling-note-id-input')).toHaveValue('456860');
    });

    it('should render disabled view', async () => {
        const promise = Promise.resolve();
        const { getByTestId, queryByRole } = setup({ disabled: true });
        expect(getByTestId('rek-sensitive-handling-note-id-input')).toHaveAttribute('disabled');
        await userEvent.click(getByTestId('rek-sensitive-handling-note-id-select'));
        expect(queryByRole('presentation')).not.toBeInTheDocument();
        await act(async () => {
            await promise;
        });
    });
});
