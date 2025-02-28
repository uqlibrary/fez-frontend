import React from 'react';
import CopyToCommunityForm from './CopyToCommunityForm';
import {
    act,
    render,
    WithRouter,
    WithReduxStore,
    fireEvent,
    waitFor,
    assertDisabled,
    assertEnabled,
    expectApiRequestToMatchSnapshot,
    api,
    waitForText,
    waitForTextToBeRemoved,
    debugApiRequestHistory,
    expectApiRequestCountToBe,
} from 'test-utils';
import * as repositories from 'repositories';
import { locale } from '../../../../../locale';

function setup(testProps = {}) {
    const props = {
        recordsSelected: {
            'UQ:123456': {
                rek_pid: 'UQ:123456',
                rek_object_type: 2,
                fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:123' }],
            },
        },
        onCancel: jest.fn(),
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <WithRouter>
                <CopyToCommunityForm {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('CopyToCommunityForm', () => {
    const assertFormInitialState = async () => {
        await waitForText(locale.validationErrors.required);
        assertDisabled('copy-to-community-submit');
    };

    beforeEach(() => {
        api.reset();
        document.createRange = () => ({
            setStart: () => {},
            setEnd: () => {},
            commonAncestorContainer: {
                nodeName: 'BODY',
                ownerDocument: document,
            },
        });
    });

    it('should correctly submit form and display success info for copy to collection form', async () => {
        api.mock.records
            .bulkUpdate()
            .instance.onGet(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: { rek_object_type: 1 } }).apiUrl,
            )
            .replyOnce(200, {
                data: [
                    { rek_pid: 'UQ:222', rek_title: 'Testing community', rek_object_type: 1 },
                    { rek_pid: 'UQ:333', rek_title: 'Test community', rek_object_type: 1 },
                ],
            });

        const { getByTestId, getByText, queryByText } = setup();
        await assertFormInitialState();

        // interact with the form
        fireEvent.change(getByTestId('rek-ismemberof-input'), { target: { value: 'test' } });
        await waitFor(() => getByTestId('rek-ismemberof-options'));
        fireEvent.click(getByText('Testing community'));

        // assert next state of the form
        await waitForTextToBeRemoved(locale.validationErrors.required);
        assertEnabled('copy-to-community-submit');

        // submit form
        act(() => {
            fireEvent.click(getByTestId('copy-to-community-submit'));
        });

        await waitFor(() => getByTestId('alert-done-copy-to-community'));
        expect(getByTestId('alert-done-copy-to-community')).toBeInTheDocument();
        debugApiRequestHistory();
        expectApiRequestToMatchSnapshot('patch', api.url.records.create);
    });

    it('should submit form and display error for copy to community form', async () => {
        api.mock.records.fail
            .bulkUpdate()
            .instance.onGet(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: { rek_object_type: 1 } }).apiUrl,
            )
            .replyOnce(200, {
                data: [
                    { rek_pid: 'UQ:222', rek_title: 'Testing community', rek_object_type: 1 },
                    { rek_pid: 'UQ:333', rek_title: 'Test community', rek_object_type: 1 },
                ],
            });

        const { getByTestId, getByText, queryByText } = setup();
        await assertFormInitialState();

        // interact with the form
        fireEvent.change(getByTestId('rek-ismemberof-input'), { target: { value: 'test' } });
        await waitFor(() => getByTestId('rek-ismemberof-options'));
        fireEvent.click(getByText('Testing community'));

        // assert next state of the form
        await waitForTextToBeRemoved(locale.validationErrors.required);
        assertEnabled('copy-to-community-submit');

        // submit form
        act(() => {
            fireEvent.click(getByTestId('copy-to-community-submit'));
        });

        await waitFor(() => getByTestId('alert-error-copy-to-community'));
        expect(getByTestId('alert-error-copy-to-community')).toBeInTheDocument();
    });

    it('should correctly submit form and display success info for remove from community', async () => {
        api.mock.records
            .bulkUpdate()
            .instance.onGet(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: { rek_object_type: 1 } }).apiUrl,
            )
            .replyOnce(200, {
                data: [
                    { rek_pid: 'UQ:222', rek_title: 'Testing community', rek_object_type: 1 },
                    { rek_pid: 'UQ:333', rek_title: 'Test community', rek_object_type: 1 },
                ],
            });

        const { getByTestId, getByText, queryByText } = setup({ isRemoveFrom: true });

        // assert initial state of the form
        await waitForText(locale.validationErrors.required);
        assertDisabled('remove-from-community-submit');

        // interact with the form
        fireEvent.change(getByTestId('rek-ismemberof-input'), { target: { value: 'test' } });
        await waitFor(() => getByTestId('rek-ismemberof-options'));
        fireEvent.click(getByText('Testing community'));

        // assert next state of the form
        await waitForTextToBeRemoved(locale.validationErrors.required);
        assertEnabled('remove-from-community-submit');

        // submit form
        act(() => {
            fireEvent.click(getByTestId('remove-from-community-submit'));
        });

        await waitFor(() => getByTestId('alert-done-remove-from-community'));
        expect(getByTestId('alert-done-remove-from-community')).toBeInTheDocument();
        expectApiRequestToMatchSnapshot('patch', api.url.records.create);
    });

    it('should submit form and display error for remove from community', async () => {
        api.mock.records.fail
            .bulkUpdate()
            .instance.onGet(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: { rek_object_type: 1 } }).apiUrl,
            )
            .replyOnce(200, {
                data: [
                    { rek_pid: 'UQ:222', rek_title: 'Testing community', rek_object_type: 1 },
                    { rek_pid: 'UQ:333', rek_title: 'Test community', rek_object_type: 1 },
                ],
            });

        const { getByTestId, getByText, queryByText } = setup({ isRemoveFrom: true });

        // assert initial state of the form
        await waitForText(locale.validationErrors.required);
        assertDisabled('remove-from-community-submit');

        // interact with the form
        fireEvent.change(getByTestId('rek-ismemberof-input'), { target: { value: 'test' } });
        await waitFor(() => getByTestId('rek-ismemberof-options'));
        fireEvent.click(getByText('Testing community'));

        // assert next state of the form
        await waitForTextToBeRemoved(locale.validationErrors.required);
        assertEnabled('remove-from-community-submit');

        // submit form
        act(() => {
            fireEvent.click(getByTestId('remove-from-community-submit'));
        });

        await waitFor(() => getByTestId('alert-error-remove-from-community'));
        expect(getByTestId('alert-error-remove-from-community')).toBeInTheDocument();
    });

    it('should display warning alert to user if work is being removed from all communities', async () => {
        api.mock.instance
            .onGet(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: { rek_object_type: 1 } }).apiUrl,
            )
            .replyOnce(200, {
                data: [
                    { rek_pid: 'UQ:123', rek_title: 'Testing community', rek_object_type: 1 },
                    { rek_pid: 'UQ:333', rek_title: 'Test community', rek_object_type: 1 },
                ],
            });

        const { getByTestId, getByText, queryByTestId } = setup({ isRemoveFrom: true });

        expect(queryByTestId('alert-warning-remove-from-community')).not.toBeInTheDocument();

        // interact with the form
        fireEvent.change(getByTestId('rek-ismemberof-input'), { target: { value: 'test' } });
        await waitFor(() => getByTestId('rek-ismemberof-options'));
        fireEvent.click(getByText('Testing community'));

        expect(getByTestId('alert-warning-remove-from-community')).toBeInTheDocument();
        assertDisabled('remove-from-community-submit');
        expectApiRequestCountToBe('patch', undefined, 0);
    });

    it('should display warning alert to user if an attempt to copy incorrect record exists in selected items', async () => {
        api.mock.instance
            .onGet(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: { rek_object_type: 1 } }).apiUrl,
            )
            .replyOnce(200, {
                data: [
                    { rek_pid: 'UQ:123', rek_title: 'Testing community', rek_object_type: 1 },
                    { rek_pid: 'UQ:333', rek_title: 'Test community', rek_object_type: 1 },
                ],
            });

        const { getByTestId, queryByTestId } = setup({
            recordsSelected: {
                'UQ:123456': {
                    rek_pid: 'UQ:123456',
                    rek_object_type: 1,
                    fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:123' }],
                },
            },
        });

        expect(queryByTestId('alert-warning-remove-from-community')).not.toBeInTheDocument();
        expect(getByTestId('alert-info-copy-to-community-notallowed')).toBeInTheDocument();
        expectApiRequestCountToBe('patch', undefined, 0);
    });
});
