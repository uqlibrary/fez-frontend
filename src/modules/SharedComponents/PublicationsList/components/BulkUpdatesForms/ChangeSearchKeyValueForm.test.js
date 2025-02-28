import React from 'react';
import ChangeSearchKeyValueForm from './ChangeSearchKeyValueForm';
import {
    act,
    render,
    WithRouter,
    WithReduxStore,
    fireEvent,
    waitFor,
    expectApiRequestToMatchSnapshot,
    api,
    expectRequiredFieldError,
    expectMissingRequiredFieldError,
    assertDisabled,
    assertEnabled,
} from 'test-utils';

function setup(testProps = {}) {
    const props = {
        recordsSelected: { 'UQ:123456': { rek_pid: 'UQ:123456' } },
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
    const assertFormInitialState = async () => {
        await expectRequiredFieldError('search-key');
        await expectMissingRequiredFieldError('rek-oa-status');
        assertDisabled('change-search-key-value-submit');
    };

    beforeEach(() => api.reset());

    it('should correctly submit form and display success info', async () => {
        api.mock.records.bulkUpdate();
        const { getByTestId, getByText, queryByTestId } = setup();
        await assertFormInitialState();

        // interact with the form
        fireEvent.mouseDown(getByTestId('search-key-select'));
        fireEvent.click(getByText('OA status'));

        // assert next state of the form on display type selected (e.g. Book)
        await expectMissingRequiredFieldError('search-key');
        await expectRequiredFieldError('rek-oa-status');
        expect(getByTestId('change-search-key-value-submit')).toHaveAttribute('disabled');

        fireEvent.mouseDown(getByTestId('rek-oa-status-select'));
        fireEvent.click(getByText('DOI'));

        // assert next state of the form on display type selected (e.g. Research book)
        await expectMissingRequiredFieldError('rek-oa-status');
        assertEnabled('change-search-key-value-submit');

        fireEvent.change(getByTestId('edit-reason-input'), { target: { value: 'test edit reason' } });

        // submit form
        act(() => {
            fireEvent.click(getByTestId('change-search-key-value-submit'));
        });

        await waitFor(() => getByTestId('alert-done-change-search-key-value'));
        expect(getByTestId('alert-done-change-search-key-value')).toBeInTheDocument();
        expectApiRequestToMatchSnapshot('patch', api.url.records.create);
    });

    it('should submit form and display error', async () => {
        api.mock.records.fail.bulkUpdate();
        const { getByTestId, getByText, queryByTestId } = setup();
        await assertFormInitialState();

        // interact with the form
        fireEvent.mouseDown(getByTestId('search-key-select'));
        fireEvent.click(getByText('OA status'));

        // assert next state of the form on display type selected (e.g. Book)
        await expectMissingRequiredFieldError('search-key');
        await expectRequiredFieldError('rek-oa-status');
        expect(getByTestId('change-search-key-value-submit')).toHaveAttribute('disabled');

        fireEvent.mouseDown(getByTestId('rek-oa-status-select'));
        fireEvent.click(getByText('DOI'));

        // assert next state of the form on display type selected (e.g. Research book)
        await expectMissingRequiredFieldError('rek-oa-status');
        assertEnabled('change-search-key-value-submit');

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

        // test Additional notes in cypress

        fireEvent.mouseDown(getByTestId('search-key-select'));
        fireEvent.click(getByText('Series'));

        expect(getByTestId('rek-series-input')).toBeInTheDocument();

        fireEvent.mouseDown(getByTestId('search-key-select'));
        fireEvent.click(getByText('Copyright notice'));

        expect(getByTestId('rek-rights-input')).toBeInTheDocument();
        // Advisory statement tested in cypress
    });
});
