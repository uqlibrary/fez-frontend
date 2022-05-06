import React from 'react';
import { act, render, fireEvent, WithReduxStore, WithRouter, waitFor } from 'test-utils';

import * as mockData from 'mock/data';

import { createMemoryHistory } from 'history';
import Immutable from 'immutable';

import CollectionsListEmbedded from './CollectionsListEmbedded';
import locale from 'locale/components';
import * as repositories from 'repositories';

const txt = locale.components.communitiesCollections;

const labels = txt.columns.labels;

const testProps = {
    title: 'test',
    key: 'UQ:12345',
    pid: 'UQ:12345',
    labels: labels,
    conf: txt,
    isSuperAdmin: false,
    open: true,
};

const setup = (testProps = {}, state = {}, testHistory = createMemoryHistory({ initialEntries: ['/'] })) => {
    return render(
        <WithReduxStore initialState={Immutable.Map(state)}>
            <WithRouter history={testHistory}>
                <CollectionsListEmbedded {...testProps} />
            </WithRouter>
        </WithReduxStore>,
    );
};

const multiPageResponse = {
    ...mockData.collectionList,
    total: 73,
    took: 38,
    per_page: 10,
    current_page: 1,
    from: 1,
    to: 10,
};
describe('CollectionsListEmbedded form', () => {
    mockApi
        .onGet(
            repositories.routes.COLLECTION_LIST_API({
                pid: testProps.pid,
                pageSize: 10,
                page: 1,
                sortBy: 'title',
                direction: 'Asc',
            }).apiUrl,
        )
        .reply(200, multiPageResponse);

    it('should render the collections embedded element', async () => {
        const { getByText, queryByText } = setup(testProps);

        await waitFor(() => getByText('Sort results by'));
        expect(getByText('Sort results by')).toBeInTheDocument();
        expect(queryByText('Add New Collection')).not.toBeInTheDocument();
    });
    it('should render the admin collections embedded element', async () => {
        const { getByText } = setup({ ...testProps, adminUser: true });

        await waitFor(() => getByText('Sort results by'));
        expect(getByText('Sort results by')).toBeInTheDocument();
        expect(getByText('Add New Collection')).toBeInTheDocument();
    });

    it('should allow page changing', async () => {
        mockApi
            .onGet(
                repositories.routes.COLLECTION_LIST_API({
                    pid: testProps.pid,
                    pageSize: 10,
                    page: 2,
                    sortBy: 'title',
                    direction: 'Asc',
                }).apiUrl,
            )
            .reply(200, { ...multiPageResponse, current_page: 2 });

        const { getByText, getByTestId } = setup(testProps);

        await waitFor(() => getByText('Sort results by'));

        const firstTestElement = getByTestId('embedded-collections-paging-bottom');
        const buttonNext = firstTestElement.querySelector('.paging-next');

        buttonNext.click();
        await waitFor(() => getByText('Sort results by'));
    });

    it('should allow perPage changing', async () => {
        mockApi
            .onGet(
                repositories.routes.COLLECTION_LIST_API({
                    pid: testProps.pid,
                    pageSize: 100,
                    page: 1,
                    sortBy: 'title',
                    direction: 'Asc',
                }).apiUrl,
            )
            .reply(200, multiPageResponse);

        const { getByText, getByTestId, getByRole, getAllByRole } = setup(testProps);

        await waitFor(() => getByText('Sort results by'));
        expect(getByTestId('pageSize').innerHTML).toBe('10');

        const element = getByTestId('pageSize');
        fireEvent.mouseDown(element);
        expect(getByRole('listbox')).not.toEqual(null);
        act(() => {
            const options = getAllByRole('option');
            fireEvent.mouseDown(options[3]);
            options[3].click();
        });
        await waitFor(() => getByText('Sort results by'));
        expect(getByTestId('pageSize').innerHTML).toBe('10');
    });

    it('should allow sortBy changing', async () => {
        mockApi
            .onGet(
                repositories.routes.COLLECTION_LIST_API({
                    pid: testProps.pid,
                    pageSize: 10,
                    page: 1,
                    sortBy: 'updated_date',
                    direction: 'Asc',
                }).apiUrl,
            )
            .reply(200, multiPageResponse);
        const { getByText, getByTestId, getByRole, getAllByRole } = setup(testProps);

        await waitFor(() => getByText('Sort results by'));

        expect(getByTestId('sortBy').innerHTML).toBe('Title');

        const element = getByTestId('sortBy');
        fireEvent.mouseDown(element);
        expect(getByRole('listbox')).not.toEqual(null);
        act(() => {
            const options = getAllByRole('option');

            fireEvent.mouseDown(options[2]);
            options[2].click();
        });

        await waitFor(() => getByText('Sort results by'));
        expect(getByTestId('sortBy').innerHTML).toBe('Updated Date');
    });
});
