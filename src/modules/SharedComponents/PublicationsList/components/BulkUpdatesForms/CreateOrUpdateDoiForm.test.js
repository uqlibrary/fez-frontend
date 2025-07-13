import React from 'react';
import CreateOrUpdateDoiForm from './CreateOrUpdateDoiForm';
import {
    act,
    render,
    WithRouter,
    WithReduxStore,
    fireEvent,
    waitFor,
    expectApiRequestToMatchSnapshot,
    api,
} from 'test-utils';

function setup(testProps = {}) {
    const props = {
        recordsSelected: {
            'UQ:123456': { rek_pid: 'UQ:123456' },
        },
        onCancel: jest.fn(),
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <WithRouter>
                <CreateOrUpdateDoiForm {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('CreateOrUpdateDoiForm', () => {
    beforeEach(() => api.reset());

    it('should not show collection warning when no collections are selected', async () => {
        const { getByTestId } = setup();
        expect(() => getByTestId('collection-alert-warning-create-or-update-doi')).toThrow(
            'Unable to find an element by: [data-testid="collection-alert-warning-create-or-update-doi"]',
        );
    });

    it('should show collection warning when collections are selected', async () => {
        const { getByTestId } = setup({
            recordsSelected: {
                'UQ:123456': { rek_pid: 'UQ:123456' },
                'UQ:123457': { rek_pid: 'UQ:123457', rek_object_type_lookup: 'Collection' },
            },
        });
        expect(getByTestId('collection-alert-warning-create-or-update-doi')).toBeInTheDocument();
    });

    it('should correctly submit form and display success info', async () => {
        api.mock.records.bulkUpdate();
        const { getByTestId } = setup();
        // assert initial state of the form
        expect(getByTestId('create-or-update-doi-submit')).not.toHaveAttribute('disabled');

        // submit form
        act(() => {
            fireEvent.click(getByTestId('create-or-update-doi-submit'));
        });

        await waitFor(() => getByTestId('alert-done-create-or-update-doi'));
        expect(getByTestId('alert-done-create-or-update-doi')).toBeInTheDocument();
        expectApiRequestToMatchSnapshot('patch', api.url.records.create);
    });

    it('should submit form and display error ', async () => {
        api.mock.records.fail.bulkUpdate();
        const { getByTestId } = setup();
        // assert initial state of the form
        expect(getByTestId('create-or-update-doi-submit')).not.toHaveAttribute('disabled');

        // submit form
        act(() => {
            fireEvent.click(getByTestId('create-or-update-doi-submit'));
        });

        await waitFor(() => getByTestId('alert-error-create-or-update-doi'));
        expect(getByTestId('alert-error-create-or-update-doi')).toBeInTheDocument();
    });
});
