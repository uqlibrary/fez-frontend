import React from 'react';
import BulkUpdates from './index';
import { render, WithReduxStore, waitForElementToBeRemoved } from 'test-utils';
import * as routes from 'repositories/routes';

import * as BulkUpdatesActions from 'actions/bulkUpdates';

function setup(state = {}) {
    return render(
        <WithReduxStore initialState={state}>
            <BulkUpdates />
        </WithReduxStore>,
    );
}

describe('BulkUpdates component', () => {
    it('should display loading screen while loading bulk updates list', async () => {
        mockApi.onGet(routes.BULK_UPDATES_API().apiUrl).reply(200, { data: [] });
        const loadBulkUpdatesList = jest.spyOn(BulkUpdatesActions, 'loadBulkUpdatesList');
        const { getByText } = setup();
        expect(getByText('Loading bulk updates')).toBeInTheDocument();
        expect(loadBulkUpdatesList).toHaveBeenCalled();
    });

    it('should show alert message if loading bulk updates list failed', async () => {
        mockApi.onGet(routes.BULK_UPDATES_API().apiUrl).reply(500);
        const { getByText } = setup();
        await waitForElementToBeRemoved(() => getByText('Loading bulk updates'));
        expect(
            getByText(
                'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
            ),
        ).toBeInTheDocument();
    });

    it('should show bulk updates list once loaded', async () => {
        mockApi.onGet(routes.BULK_UPDATES_API().apiUrl).reply(200, { data: [] });
        const { getByText, getByTestId } = setup();
        await waitForElementToBeRemoved(() => getByText('Loading bulk updates'));
        expect(getByTestId('bulk-updates-list')).toBeInTheDocument();
    });
});
