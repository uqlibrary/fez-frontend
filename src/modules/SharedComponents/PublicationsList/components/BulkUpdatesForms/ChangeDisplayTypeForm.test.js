import React from 'react';
import ChangeDisplayTypeForm from './ChangeDisplayTypeForm';
import { act, render, WithRouter, WithReduxStore, fireEvent, waitFor } from 'test-utils';
import * as repositories from 'repositories';

function setup(testProps = {}) {
    const props = {
        recordsSelected: [{ rek_pid: 'UQ:123456' }],
        onCancel: jest.fn(),
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <WithRouter>
                <ChangeDisplayTypeForm {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('ChangeDisplayTypeForm', () => {
    it('should correctly submit form and display success info', async () => {
        mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).reply(200, {});
        const { getByTestId, getByText, queryByTestId } = setup();

        // assert initial state of the form
        expect(getByTestId('rek-display-type-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-display-type-helper-text')).toHaveTextContent('This field is required');
        expect(queryByTestId('rek-subtype-select')).not.toBeInTheDocument();
        expect(getByTestId('change-display-type-submit')).toHaveAttribute('disabled');

        // interact with the form
        fireEvent.mouseDown(getByTestId('rek-display-type-select'));
        fireEvent.click(getByText('Book'));

        // assert next state of the form on display type selected (e.g. Book)
        expect(queryByTestId('rek-display-type-helper-text')).not.toBeInTheDocument();
        expect(getByTestId('rek-subtype-select')).toBeInTheDocument();
        expect(getByTestId('rek-subtype-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-subtype-helper-text')).toHaveTextContent('This field is required');
        expect(getByTestId('change-display-type-submit')).toHaveAttribute('disabled');

        fireEvent.mouseDown(getByTestId('rek-subtype-select'));
        fireEvent.click(getByText('Research book (original research)'));

        // assert next state of the form on display type selected (e.g. Research book)
        expect(queryByTestId('rek-subtype-helper-text')).not.toBeInTheDocument();
        expect(getByTestId('change-display-type-submit')).not.toHaveAttribute('disabled');

        // submit form
        act(() => {
            fireEvent.click(getByTestId('change-display-type-submit'));
        });

        await waitFor(() => getByTestId('alert-done-change-display-type'));
        expect(getByTestId('alert-done-change-display-type')).toBeInTheDocument();
    });

    it('should submit form and display error', async () => {
        mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).reply(500, {});
        const { getByTestId, getByText, queryByTestId } = setup();

        // assert initial state of the form
        expect(getByTestId('rek-display-type-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-display-type-helper-text')).toHaveTextContent('This field is required');
        expect(queryByTestId('rek-subtype-select')).not.toBeInTheDocument();
        expect(getByTestId('change-display-type-submit')).toHaveAttribute('disabled');

        // interact with the form
        fireEvent.mouseDown(getByTestId('rek-display-type-select'));
        fireEvent.click(getByText('Book'));

        // assert next state of the form on display type selected (e.g. Book)
        expect(queryByTestId('rek-display-type-helper-text')).not.toBeInTheDocument();
        expect(getByTestId('rek-subtype-select')).toBeInTheDocument();
        expect(getByTestId('rek-subtype-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-subtype-helper-text')).toHaveTextContent('This field is required');
        expect(getByTestId('change-display-type-submit')).toHaveAttribute('disabled');

        fireEvent.mouseDown(getByTestId('rek-subtype-select'));
        fireEvent.click(getByText('Research book (original research)'));

        // assert next state of the form on display type selected (e.g. Research book)
        expect(queryByTestId('rek-subtype-helper-text')).not.toBeInTheDocument();
        expect(getByTestId('change-display-type-submit')).not.toHaveAttribute('disabled');

        // submit form
        act(() => {
            fireEvent.click(getByTestId('change-display-type-submit'));
        });

        await waitFor(() => getByTestId('alert-error-change-display-type'));
        expect(getByTestId('alert-error-change-display-type')).toBeInTheDocument();
    });
});
