import React from 'react';
import CollectionSelectField from './CollectionSelectField';
import { render, fireEvent, WithReduxStore, waitFor } from 'test-utils';
import * as repositories from 'repositories';
import * as SearchActions from 'actions/search';

function setup(testProps = {}) {
    const props = {
        genericSelectFieldId: 'collection-pid',
        displayEmpty: true,
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <CollectionSelectField {...props} />
        </WithReduxStore>,
    );
}

describe('CollectionSelectField', () => {
    it('should render collection select field', async () => {
        const onChangeFn = jest.fn();
        const collectionsList = jest.spyOn(SearchActions, 'collectionsList');

        mockApi
            .onGet(repositories.routes.COLLECTIONS_BY_COMMUNITY_LOOKUP_API({ communityPid: 'UQ:444' }).apiUrl)
            .replyOnce(200, {
                data: [
                    { rek_pid: 'UQ:111', rek_title: 'Testing collection', rek_security_policy: 5 },
                    { rek_pid: 'UQ:123', rek_title: 'Tested collection', rek_security_policy: 1 },
                ],
            });

        const { getByTestId, getByText } = setup({
            onChange: onChangeFn,
            meta: {
                error: 'This field is required',
            },
            loadingHint: 'Loading collections...',
            selectPrompt: 'Please select a collection',
            communityId: 'UQ:444',
        });

        expect(getByTestId('collection-pid-helper-text')).toBeInTheDocument();
        expect(getByTestId('collection-pid-helper-text')).toHaveTextContent('This field is required');
        expect(getByText('Loading collections...')).toBeInTheDocument();

        await waitFor(() => getByText('Please select a collection'));

        expect(collectionsList).toHaveBeenCalledWith('UQ:444');

        fireEvent.mouseDown(getByTestId('collection-pid-select'));
        fireEvent.click(getByText('Tested collection (Administrators)'));

        expect(onChangeFn).toHaveBeenCalledWith('UQ:123');
    });
});
