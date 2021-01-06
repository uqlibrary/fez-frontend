import React from 'react';
import CommunitySelectField from './CommunitySelectField';
import { render, fireEvent, WithReduxStore, waitFor } from 'test-utils';
import * as repositories from 'repositories';
import * as SearchActions from 'actions/search';

function setup(testProps = {}) {
    const props = {
        genericSelectFieldId: 'community-pid',
        displayEmpty: true,
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <CommunitySelectField {...props} />
        </WithReduxStore>,
    );
}

describe('CommunitySelectField', () => {
    it('should render community select field with html stripped off', async () => {
        const onChangeFn = jest.fn();
        const communitiesList = jest.spyOn(SearchActions, 'communitiesList');

        mockApi
            .onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: '.*' }).apiUrl)
            .replyOnce(200, {
                data: [
                    { rek_pid: 'UQ:111', rek_title: 'Testing community' },
                    { rek_pid: 'UQ:123', rek_title: '<b>Tested community</b>' },
                ],
            });

        const { getByTestId, getByText } = setup({
            input: {
                onChange: onChangeFn,
            },
            meta: {
                error: 'This field is required',
            },
            loadingHint: 'Loading communities...',
            selectPrompt: 'Please select a community',
        });

        expect(getByTestId('community-pid-helper-text')).toBeInTheDocument();
        expect(getByTestId('community-pid-helper-text')).toHaveTextContent('This field is required');
        expect(getByText('Loading communities...')).toBeInTheDocument();

        await waitFor(() => getByText('Please select a community'));

        expect(communitiesList).toHaveBeenCalled();

        fireEvent.mouseDown(getByTestId('community-pid-select'));
        fireEvent.click(getByText('Tested community'));

        expect(onChangeFn).toHaveBeenCalledWith('UQ:123');
    });

    // it('should not render community list', async () => {
    //     const onChangeFn = jest.fn();

    //     mockApi
    //         .onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({ searchQueryParams: '.*' }).apiUrl)
    //         .replyOnce(200, {
    //             data: [],
    //         });

    //     const { getByTestId, getByText } = setup({
    //         input: {
    //             onChange: onChangeFn,
    //         },
    //         meta: {
    //             error: 'This field is required',
    //         },
    //         loadingHint: 'Loading communities...',
    //         selectPrompt: 'Please select a community',
    //     });

    //     expect(getByTestId('community-pid-helper-text')).toBeInTheDocument();
    //     expect(getByTestId('community-pid-helper-text')).toHaveTextContent('This field is required');
    //     expect(getByText('Loading communities...')).toBeInTheDocument();

    //     await waitFor(() => getByText('Please select a community'));
    // });
});
