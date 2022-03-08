import React from 'react';

import {
    act,
    screen,
    render,
    fireEvent,
    WithReduxStore,
    WithRouter,
    waitFor,
    waitForElementToBeRemoved,
} from 'test-utils';

import * as mockData from 'mock/data';

import * as UseIsUserSuperAdmin from 'hooks/useIsUserSuperAdmin';
import { createMemoryHistory } from 'history';
import Immutable from 'immutable';
// import * as repositories from 'repositories';
import { Route } from 'react-router';
import CommunityList from './CommunityList';
import * as repositories from 'repositories';

const setup = ({ state = {}, testHistory = createMemoryHistory({ initialEntries: ['/'] }) } = ({} = {})) => {
    return render(
        <WithRouter history={testHistory}>
            <WithReduxStore initialState={Immutable.Map(state)}>
                <CommunityList {...state} />
            </WithReduxStore>
        </WithRouter>,
    );
};
describe('CommunityList form', () => {
    const testPid1 = 'UQ:12096';
    const testPid2 = 'UQ:7556';

    const pageSize = 10;
    const page = 1;
    const direction = 'Asc';
    const sortBy = 'title';
    mockApi
        .onGet(
            repositories.routes.COMMUNITY_LIST_API({
                pageSize: pageSize,
                page: page,
                sortBy: sortBy,
                direction: direction,
            }).apiUrl,
        )
        .reply(200, mockData.communityList);

    const useIsUserSuperAdmin = jest.spyOn(UseIsUserSuperAdmin, 'useIsUserSuperAdmin');
    it('should render the community list page as admin', async () => {
        useIsUserSuperAdmin.mockImplementation(() => true);

        const { getByText } = setup();
        await waitFor(() => getByText('Sort results by'));
        expect(getByText('Add New Community')).toBeInTheDocument();
    });
    it('should render the community list page as non admin', async () => {
        useIsUserSuperAdmin.mockImplementation(() => false);

        const { getByText, queryByText } = setup();
        await waitFor(() => getByText('Sort results by'));
        expect(queryByText('Add New Community')).not.toBeInTheDocument();
    });
    it('should render the community list page with auto-collapse turned on and off', async () => {
        mockApi
            .onGet(
                repositories.routes.COLLECTION_LIST_API({
                    pid: testPid1,
                    pageSize: pageSize,
                    page: page,
                    sortBy: 'title',
                    direction: direction,
                }).apiUrl,
            )
            .reply(200, mockData.collectionList);
        mockApi
            .onGet(
                repositories.routes.COLLECTION_LIST_API({
                    pid: testPid2,
                    pageSize: pageSize,
                    page: page,
                    sortBy: 'title',
                    direction: direction,
                }).apiUrl,
            )
            .reply(200, mockData.collectionList);

        useIsUserSuperAdmin.mockImplementation(() => false);

        const { getByTestId, getByText, queryAllByText, getByRole } = setup();
        await waitFor(() => getByText('Sort results by'));
        expect(getByText('Auto-close collections')).toBeInTheDocument();

        act(() => {
            fireEvent.click(getByTestId('collection-auto-collapse'));
        });

        fireEvent.click(getByTestId('expand-row-UQ:12096'));
        await waitForElementToBeRemoved(() => getByTestId('collections-page-loading'));

        expect(
            getByText("Displaying 1 to 3 of 3 collections for 'Aboriginal and Torres Strait Islander Studies Unit'"),
        ).toBeInTheDocument();

        expect(queryAllByText(/Displaying 1 to 3 of 3 collections/).length).toBe(1);

        fireEvent.click(getByTestId('expand-row-UQ:7556'));
        await waitForElementToBeRemoved(() => getByTestId('collections-page-loading'));
        expect(queryAllByText(/Displaying 1 to 3 of 3 collections/).length).toBe(1);

        act(() => {
            fireEvent.click(getByTestId('collection-auto-collapse'));
        });

        fireEvent.click(getByTestId('expand-row-UQ:12096'));
        await waitForElementToBeRemoved(() => getByTestId('collections-page-loading'));
        expect(queryAllByText(/Displaying 1 to 3 of 3 collections/).length).toBe(2);
    });
    it('should render the community list page using page parameters', async () => {
        useIsUserSuperAdmin.mockImplementation(() => false);
        window.history.pushState({}, 'Test Title', '/communities?pageSize=10&page=1&sortBy=title&sortDirection=Asc');
        const { getByText, queryByText } = setup();
        await waitFor(() => getByText('Sort results by'));
        expect(queryByText('Add New Community')).not.toBeInTheDocument();
    });
});
