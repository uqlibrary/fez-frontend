import React from 'react';
import ChangeSearchKeyValueForm from './ChangeSearchKeyValueForm';
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
                <ChangeSearchKeyValueForm {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('ChangeSearchKeyValueForm', () => {
    it('should correctly submit form and display success info', async () => {
        mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).reply(200, {});
        const { getByTestId, getByText, queryByTestId } = setup();

        // assert initial state of the form
        expect(getByTestId('search-key-helper-text')).toBeInTheDocument();
        expect(getByTestId('search-key-helper-text')).toHaveTextContent('This field is required');
        expect(queryByTestId('rek-oa-status-select')).not.toBeInTheDocument();
        expect(getByTestId('change-search-key-value-submit')).toHaveAttribute('disabled');

        // interact with the form
        fireEvent.mouseDown(getByTestId('search-key-select'));
        fireEvent.click(getByText('OA status'));

        // assert next state of the form on display type selected (e.g. Book)
        expect(queryByTestId('search-key-helper-text')).not.toBeInTheDocument();
        expect(getByTestId('rek-oa-status-select')).toBeInTheDocument();
        expect(getByTestId('rek-oa-status-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-oa-status-helper-text')).toHaveTextContent('This field is required');
        expect(getByTestId('change-search-key-value-submit')).toHaveAttribute('disabled');

        fireEvent.mouseDown(getByTestId('rek-oa-status-select'));
        fireEvent.click(getByText('DOI'));

        // assert next state of the form on display type selected (e.g. Research book)
        expect(queryByTestId('rek-oa-status-helper-text')).not.toBeInTheDocument();
        expect(getByTestId('change-search-key-value-submit')).not.toHaveAttribute('disabled');

        fireEvent.change(getByTestId('edit-reason-input'), { target: { value: 'test edit reason' } });

        // submit form
        act(() => {
            fireEvent.click(getByTestId('change-search-key-value-submit'));
        });

        await waitFor(() => getByTestId('alert-done-change-search-key-value'));
        expect(getByTestId('alert-done-change-search-key-value')).toBeInTheDocument();
    });

    it('should submit form and display error', async () => {
        mockApi.onPatch(repositories.routes.NEW_RECORD_API().apiUrl).reply(500, {});
        const { getByTestId, getByText, queryByTestId } = setup();

        // assert initial state of the form
        expect(getByTestId('search-key-helper-text')).toBeInTheDocument();
        expect(getByTestId('search-key-helper-text')).toHaveTextContent('This field is required');
        expect(queryByTestId('rek-oa-status-select')).not.toBeInTheDocument();
        expect(getByTestId('change-search-key-value-submit')).toHaveAttribute('disabled');

        // interact with the form
        fireEvent.mouseDown(getByTestId('search-key-select'));
        fireEvent.click(getByText('OA status'));

        // assert next state of the form on display type selected (e.g. Book)
        expect(queryByTestId('search-key-helper-text')).not.toBeInTheDocument();
        expect(getByTestId('rek-oa-status-select')).toBeInTheDocument();
        expect(getByTestId('rek-oa-status-helper-text')).toBeInTheDocument();
        expect(getByTestId('rek-oa-status-helper-text')).toHaveTextContent('This field is required');
        expect(getByTestId('change-search-key-value-submit')).toHaveAttribute('disabled');

        fireEvent.mouseDown(getByTestId('rek-oa-status-select'));
        fireEvent.click(getByText('DOI'));

        // assert next state of the form on display type selected (e.g. Research book)
        expect(queryByTestId('rek-oa-status-helper-text')).not.toBeInTheDocument();
        expect(getByTestId('change-search-key-value-submit')).not.toHaveAttribute('disabled');

        // submit form
        act(() => {
            fireEvent.click(getByTestId('change-search-key-value-submit'));
        });

        await waitFor(() => getByTestId('alert-error-change-search-key-value'));
        expect(getByTestId('alert-error-change-search-key-value')).toBeInTheDocument();
    });

    it('should render correct field on selecting search field', async () => {
        const { getByTestId, getByText } = setup();

        // interact with the form
        fireEvent.mouseDown(getByTestId('search-key-select'));
        fireEvent.click(getByText('Advisory statement'));

        expect(getByTestId('rek-advisory-statement')).toBeInTheDocument();

        fireEvent.mouseDown(getByTestId('search-key-select'));
        fireEvent.click(getByText('OA status'));

        expect(getByTestId('rek-oa-status-select')).toBeInTheDocument();

        fireEvent.mouseDown(getByTestId('search-key-select'));
        fireEvent.click(getByText('Scopus doc type'));

        expect(getByTestId('rek-scopus-doc-type-select')).toBeInTheDocument();

        fireEvent.mouseDown(getByTestId('search-key-select'));
        fireEvent.click(getByText('WOK doc type'));

        expect(getByTestId('rek-wok-doc-type-select')).toBeInTheDocument();

        fireEvent.mouseDown(getByTestId('search-key-select'));
        fireEvent.click(getByText('School, Centre or Institute'));

        expect(getByTestId('rek-org-unit-name-input')).toBeInTheDocument();

        fireEvent.mouseDown(getByTestId('search-key-select'));
        fireEvent.click(getByText('Additional notes'));

        expect(getByTestId('rek-notes')).toBeInTheDocument();

        fireEvent.mouseDown(getByTestId('search-key-select'));
        fireEvent.click(getByText('Series'));

        expect(getByTestId('rek-series-input')).toBeInTheDocument();

        fireEvent.mouseDown(getByTestId('search-key-select'));
        fireEvent.click(getByText('Copyright notice'));

        expect(getByTestId('rek-rights-input')).toBeInTheDocument();
    });
});
