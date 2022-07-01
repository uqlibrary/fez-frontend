import React from 'react';

import { act, render, fireEvent, WithReduxStore, WithRouter, waitFor, waitForElementToBeRemoved } from 'test-utils';

import * as mockData from 'mock/data';

import * as PushHistory from './components/functions';

import * as UserIsAdmin from 'hooks/userIsAdmin';
import { createMemoryHistory } from 'history';
import Immutable from 'immutable';

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

    const userIsAdmin = jest.spyOn(UserIsAdmin, 'userIsAdmin');
    it('should render the community list page as admin', async () => {
        userIsAdmin.mockImplementation(() => true);

        const { getByText } = setup();
        await waitFor(() => getByText('Sort results by'));
        expect(getByText('Add New Community')).toBeInTheDocument();
    });
    it('should render the community list page as non admin', async () => {
        userIsAdmin.mockImplementation(() => false);

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

        userIsAdmin.mockImplementation(() => false);

        const { getByTestId, getByText, queryAllByText } = setup();
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
        userIsAdmin.mockImplementation(() => false);
        window.history.pushState({}, 'Test Title', '/communities?pageSize=10&page=1&sortBy=title&sortDirection=Asc');
        const { getByText, queryByText, getByTestId } = setup();
        await waitFor(() => getByText('Sort results by'));
        expect(queryByText('Add New Community')).not.toBeInTheDocument();
        const element = getByTestId('community-collections-paging-bottom');
        const button = element.querySelector('.paging-next');
        act(() => {
            fireEvent.click(button);
        });
    });
    it('should allow page changing', async () => {
        mockApi
            .onGet(
                repositories.routes.COMMUNITY_LIST_API({
                    pageSize: pageSize,
                    page: 2,
                    sortBy: sortBy,
                    direction: direction,
                }).apiUrl,
            )
            .reply(200, mockData.communityList);

        const { getByText, getByTestId } = setup();

        const testFn = jest.spyOn(PushHistory, 'pushHistory');
        await waitFor(() => getByText('Sort results by'));

        const firstTestElement = getByTestId('community-collections-paging-bottom');
        const buttonNext = firstTestElement.querySelector('.paging-next');

        buttonNext.click();
        await waitFor(() => getByText('Sort results by'));
        expect(testFn).toHaveBeenCalled();

        const secondTestElement = getByTestId('community-collections-paging-bottom');
        const buttonPrev = secondTestElement.querySelector('.paging-previous');
        buttonPrev.click();
        await waitFor(() => getByText('Sort results by'));
        expect(testFn).toHaveBeenCalled();
    });
    it('should allow perPage changing', async () => {
        mockApi
            .onGet(
                repositories.routes.COMMUNITY_LIST_API({
                    pageSize: 100,
                    page: 1,
                    sortBy: sortBy,
                    direction: direction,
                }).apiUrl,
            )
            .reply(200, mockData.communityList);

        const { getByText, getByTestId, getByRole, getAllByRole } = setup();

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
        expect(getByTestId('pageSize').innerHTML).toBe('100');
    });
    it('should allow sortBy changing', async () => {
        mockApi
            .onGet(
                repositories.routes.COMMUNITY_LIST_API({
                    pageSize: 10,
                    page: 1,
                    sortBy: 'updated_date',
                    direction: direction,
                }).apiUrl,
            )
            .reply(200, mockData.communityList);
        const { getByText, getByTestId, getByRole, getAllByRole } = setup();

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
    it('should show relevant error message', async () => {
        mockApi
            .onGet(
                repositories.routes.COMMUNITY_LIST_API({
                    pageSize: pageSize,
                    page: page,
                    sortBy: sortBy,
                    direction: direction,
                }).apiUrl,
            )
            .reply(500, { error: 'Error' });

        userIsAdmin.mockImplementation(() => false);

        const { getByText } = setup();
        await waitFor(() => getByText(/An error has occurred/));
        expect(getByText(/An error has occurred/)).toBeInTheDocument();
    });
});
