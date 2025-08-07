import React from 'react';
import DirectorySelectField from './DirectorySelectField';
import { render, fireEvent, WithReduxStore, waitFor } from 'test-utils';
import * as repositories from 'repositories';
import * as SearchActions from 'actions/batchImport';

function setup(testProps = {}) {
    const props = {
        genericSelectFieldId: 'directory',
        displayEmpty: true,
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <DirectorySelectField {...props} />
        </WithReduxStore>,
    );
}

describe('DirectorySelectField', () => {
    it('should render directory select field', async () => {
        const onChangeFn = jest.fn();
        const getBatchImportDirectories = jest.spyOn(SearchActions, 'getBatchImportDirectories');

        mockApi.onGet(repositories.routes.BATCH_IMPORT_DIRECTORIES_API({}).apiUrl).replyOnce(200, {
            data: ['Test directory 1', 'Test directory 2'],
        });

        const { getByTestId, getByText } = setup({
            onChange: onChangeFn,
            state: {
                error: 'This field is required',
            },
            loadingHint: 'Loading directories...',
            selectPrompt: 'Please select a directory',
        });

        expect(getByTestId('directory-helper-text')).toBeInTheDocument();
        expect(getByTestId('directory-helper-text')).toHaveTextContent('This field is required');
        expect(getByText('Loading directories...')).toBeInTheDocument();

        await waitFor(() => getByText('Please select a directory'));

        expect(getBatchImportDirectories).toHaveBeenCalled();

        fireEvent.mouseDown(getByTestId('directory-select'));
        fireEvent.click(getByText('Test directory 1'));

        expect(onChangeFn).toHaveBeenCalledWith('Test directory 1');
    });
});
