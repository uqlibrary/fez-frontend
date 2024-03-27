import React from 'react';

import {
    act,
    render,
    fireEvent,
    WithReduxStore,
    WithRouter,
    waitFor,
    waitForElementToBeRemoved,
    createMatchMedia,
    within,
} from 'test-utils';

import * as mockData from 'mock/data';

import * as UserIsAdmin from 'hooks/userIsAdmin';

import CommunityList from './CommunityList';
import * as repositories from 'repositories';

const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
}));

const setup = (props = {}) => {
    return render(
        <WithReduxStore>
            <WithRouter>
                <CommunityList {...props} />
            </WithRouter>
        </WithReduxStore>,
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

        fireEvent.click(getByTestId('collection-auto-collapse'));

        fireEvent.click(getByTestId('expand-row-UQ:12096'));
        await waitForElementToBeRemoved(() => getByTestId('collections-page-loading'));

        expect(
            getByText("Displaying 1 to 3 of 3 collections for 'Aboriginal and Torres Strait Islander Studies Unit'"),
        ).toBeInTheDocument();

        expect(queryAllByText(/Displaying 1 to 3 of 3 collections/).length).toBe(1);

        fireEvent.click(getByTestId('expand-row-UQ:7556'));
        await waitForElementToBeRemoved(() => getByTestId('collections-page-loading'));
        expect(queryAllByText(/Displaying 1 to 3 of 3 collections/).length).toBe(1);

        fireEvent.click(getByTestId('collection-auto-collapse'));

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
        fireEvent.click(button);
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

        await waitFor(() => getByText('Sort results by'));

        const firstTestElement = getByTestId('community-collections-paging-bottom');
        const buttonNext = firstTestElement.querySelector('.paging-next');

        act(() => {
            buttonNext.click();
        });
        await waitFor(() => getByText('Sort results by'));
        expect(mockUseNavigate).toHaveBeenCalled();

        const secondTestElement = getByTestId('community-collections-paging-bottom');
        const buttonPrev = secondTestElement.querySelector('.paging-previous');
        buttonPrev.click();
        await waitFor(() => getByText('Sort results by'));
        expect(mockUseNavigate).toHaveBeenCalled();
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
        expect(getByTestId('publication-list-sorting-page-size')).toHaveTextContent('10');

        const element = getByTestId('publication-list-sorting-page-size');
        fireEvent.mouseDown(within(element).getByRole('combobox'));
        expect(getByRole('listbox')).not.toEqual(null);

        const options = getAllByRole('option');
        fireEvent.mouseDown(options[3]);
        act(() => {
            options[3].click();
        });
        await waitFor(() => getByText('Sort results by'));
        expect(getByTestId('publication-list-sorting-page-size')).toHaveTextContent('100');
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

        expect(getByTestId('publication-list-sorting-sort-by')).toHaveTextContent('Title');

        const element = getByTestId('publication-list-sorting-sort-by');
        fireEvent.mouseDown(within(element).getByRole('combobox'));
        expect(getByRole('listbox')).not.toEqual(null);

        const options = getAllByRole('option');
        fireEvent.mouseDown(options[2]);
        act(() => {
            options[2].click();
        });

        await waitFor(() => getByText('Sort results by'));
        expect(getByTestId('publication-list-sorting-sort-by')).toHaveTextContent('Updated Date');
    });

    it('should allow exporting of community page results', async () => {
        window.matchMedia = createMatchMedia(1920);
        userIsAdmin.mockImplementation(() => false);
        const { getByText, getByTestId, getByRole } = setup();
        await waitFor(() => getByText('Export page results'));

        expect(getByTestId('export-publications-format')).toBeInTheDocument();

        fireEvent.mouseDown(within(getByTestId('export-publications-format')).getByRole('combobox'));

        expect(getByRole('listbox')).toBeInTheDocument();

        fireEvent.click(getByTestId('export-publication-option-0'));

        expect(getByTestId('communities-results-exporting')).toBeInTheDocument();
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
