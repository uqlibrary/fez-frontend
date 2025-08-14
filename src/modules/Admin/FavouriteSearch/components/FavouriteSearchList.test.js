import React from 'react';
import FavouriteSearchList from './FavouriteSearchList';
import { rtlRender, fireEvent, userEvent } from 'test-utils';
import { waitFor } from '@testing-library/dom';

function setup(testProps = {}, renderer = rtlRender) {
    const props = {
        list: [],
        handleRowDelete: jest.fn(() => Promise.resolve()),
        handleRowUpdate: jest.fn(() => Promise.resolve()),
        ...testProps,
    };

    return renderer(<FavouriteSearchList {...props} />);
}

describe('FavouriteSearchList', () => {
    const getRows = () => document.querySelectorAll('.MuiDataGrid-row');
    const getRow = index => getRows()[index || 0];

    it('should render empty list', () => {
        const { getByText } = setup();
        expect(getByText('No records to display')).toBeInTheDocument();
    });

    it('should render rows for favourite search', () => {
        setup({
            list: [
                {
                    fvs_id: 1,
                    fvs_description: 'test',
                    fvs_alias: 'test',
                    fvs_search_parameters: 'test',
                },
            ],
        });

        expect(getRow()).toBeInTheDocument();
    });

    it('should render edit component for favourite search row on clicking edit button', () => {
        const { queryByTestId, getByTestId } = setup({
            list: [
                {
                    fvs_id: 1,
                    fvs_description: 'test',
                    fvs_alias: 'test',
                    fvs_search_parameters: 'test',
                },
            ],
        });
        const listItem = getRow();
        expect(queryByTestId('fvs-description-input')).not.toBeInTheDocument();
        fireEvent.click(getByTestId('favourite-search-list-item-0-edit', listItem));
        expect(getByTestId('fvs-description-input')).toBeInTheDocument();
    });

    it('should render error message for empty description field while editing', async () => {
        const { getByTestId, findByTestId } = setup({
            list: [
                {
                    fvs_id: 1,
                    fvs_description: 'test',
                    fvs_alias: 'test',
                    fvs_search_parameters: 'test',
                },
            ],
        });
        const listItem = getRow();
        fireEvent.click(getByTestId('favourite-search-list-item-0-edit', listItem));

        fireEvent.change(getByTestId('fvs-description-input'), { target: { value: '' } });

        await findByTestId('fvs-description-helper-text');

        expect(getByTestId('fvs-description-helper-text')).toHaveTextContent('This field is required');
    });

    it('should not remove row if handleRowDelete throws exception (catch in handleDeleteRow)', async () => {
        const { getByTestId } = setup({
            list: [
                {
                    fvs_id: 1,
                    fvs_description: 'test',
                    fvs_alias: 'test',
                    fvs_search_parameters: 'test',
                },
                {
                    fvs_id: 2,
                    fvs_description: 'testing',
                    fvs_alias: 'testing',
                    fvs_search_parameters: 'testing',
                },
            ],
            handleRowDelete: jest.fn(() => Promise.reject(new Error('Delete failed'))),
        });
        expect(getRows().length).toBe(2);

        fireEvent.click(getByTestId('favourite-search-list-item-0-delete'));
        fireEvent.click(getByTestId('favourite-search-list-item-0-save'));

        // Wait for the UI to update after the failed delete
        await waitFor(() => {
            expect(getByTestId('fvs-description-0')).toHaveTextContent('test');
            expect(getByTestId('fvs-alias-0')).toHaveTextContent('test');
        });

        // Both rows should still be present
        expect(getRows().length).toBe(2);
    });

    it('should render correct error message for alias field while editing', async () => {
        const { getByTestId, queryByTestId, findByTestId } = setup({
            list: [
                {
                    fvs_id: 1,
                    fvs_description: 'test',
                    fvs_alias: 'test',
                    fvs_search_parameters: 'test',
                },
            ],
        });
        const listItem = getRow();
        fireEvent.click(getByTestId('favourite-search-list-item-0-edit', listItem));

        fireEvent.change(getByTestId('fvs-alias-input'), { target: { value: '' } });
        expect(queryByTestId('fvs-alias-helper-text')).not.toBeInTheDocument();

        fireEvent.change(getByTestId('fvs-alias-input'), { target: { value: 'test_' } });
        await findByTestId('fvs-alias-helper-text');
        expect(getByTestId('fvs-alias-helper-text')).toHaveTextContent('Alias is not valid');

        fireEvent.change(getByTestId('fvs-alias-input'), { target: { value: '_test' } });
        await findByTestId('fvs-alias-helper-text');
        expect(getByTestId('fvs-alias-helper-text')).toHaveTextContent('Alias is not valid');

        fireEvent.change(getByTestId('fvs-alias-input'), { target: { value: '____' } });
        await findByTestId('fvs-alias-helper-text');
        expect(getByTestId('fvs-alias-helper-text')).toHaveTextContent('Alias is not valid');

        fireEvent.change(getByTestId('fvs-alias-input'), { target: { value: 'test' } });
        await waitFor(() => expect(queryByTestId('fvs-alias-helper-text')).not.toBeInTheDocument());

        fireEvent.change(getByTestId('fvs-alias-input'), { target: { value: 'test_alias' } });
        await findByTestId('fvs-alias-helper-text');
        expect(getByTestId('fvs-alias-helper-text')).toHaveTextContent('Alias is not valid');
    });

    it('should render updated info after editing', async () => {
        const { getByTestId, findByTestId } = setup({
            list: [
                {
                    fvs_id: 1,
                    fvs_description: 'test',
                    fvs_alias: 'test',
                    fvs_search_parameters: 'test',
                },
            ],
        });
        const listItem = getRow();

        expect(getByTestId('fvs-description-0', listItem)).toHaveTextContent('test');
        expect(getByTestId('fvs-alias-0', listItem)).toHaveTextContent('test');

        fireEvent.click(getByTestId('favourite-search-list-item-0-edit'));

        await userEvent.type(getByTestId('fvs-description-input'), 'testing');
        await userEvent.type(getByTestId('fvs-alias-input'), 'testing-testing');

        await userEvent.click(getByTestId('favourite-search-list-item-0-save'));

        await findByTestId('fvs-description-0');

        expect(getByTestId('fvs-description-0')).toHaveTextContent('testing');
        expect(getByTestId('fvs-alias-0')).toHaveTextContent('testing-testing');
    });

    it('should cancel editing item', async () => {
        const { getByTestId, findByTestId } = setup({
            list: [
                {
                    fvs_id: 1,
                    fvs_description: 'test',
                    fvs_alias: 'test',
                    fvs_search_parameters: 'test',
                },
            ],
        });
        const listItem = getRow();

        expect(getByTestId('fvs-description-0', listItem)).toHaveTextContent('test');
        expect(getByTestId('fvs-alias-0', listItem)).toHaveTextContent('test');

        fireEvent.click(getByTestId('favourite-search-list-item-0-edit'));

        await userEvent.type(getByTestId('fvs-description-input'), 'testing');
        await userEvent.type(getByTestId('fvs-alias-input'), 'testing-testing');

        await userEvent.click(getByTestId('favourite-search-list-item-0-cancel'));

        await findByTestId('fvs-description-0');

        expect(getByTestId('fvs-description-0')).toHaveTextContent('test');
        expect(getByTestId('fvs-alias-0')).toHaveTextContent('test');
    });

    it('should render previous info if handleRowUpdate throws exception', async () => {
        const { getByTestId, findByTestId } = setup({
            list: [
                {
                    fvs_id: 1,
                    fvs_description: 'test',
                    fvs_alias: 'test',
                    fvs_search_parameters: 'test',
                },
            ],
            handleRowUpdate: jest.fn(() => Promise.reject()),
        });
        const listItem = getRow();

        expect(getByTestId('fvs-description-0', listItem)).toHaveTextContent('test');
        expect(getByTestId('fvs-alias-0', listItem)).toHaveTextContent('test');

        fireEvent.click(getByTestId('favourite-search-list-item-0-edit'));

        fireEvent.change(getByTestId('fvs-description-input'), { target: { value: 'testing' } });
        fireEvent.change(getByTestId('fvs-alias-input'), { target: { value: 'testing-testing' } });

        await userEvent.click(getByTestId('favourite-search-list-item-0-save'));

        await findByTestId('fvs-description-0');
        expect(getByTestId('fvs-description-0')).toHaveTextContent('test');
        expect(getByTestId('fvs-alias-0')).toHaveTextContent('test');
    });

    it('should delete favourite search item', async () => {
        const { getByTestId } = setup({
            list: [
                {
                    fvs_id: 1,
                    fvs_description: 'test',
                    fvs_alias: 'test',
                    fvs_search_parameters: 'test',
                },
                {
                    fvs_id: 2,
                    fvs_description: 'testing',
                    fvs_alias: 'testing',
                    fvs_search_parameters: 'testing',
                },
            ],
        });
        expect(getRows().length).toBe(2);

        fireEvent.click(getByTestId('favourite-search-list-item-0-delete'));
        fireEvent.click(getByTestId('favourite-search-list-item-0-save'));

        await waitFor(() => getByTestId('fvs-description-0'), { timeout: 1500 });

        expect(getByTestId('fvs-description-0')).toHaveTextContent('testing');
        expect(getByTestId('fvs-alias-0')).toHaveTextContent('testing');
    });

    it('should cancel deletion of favourite search item', async () => {
        const { getByTestId } = setup({
            list: [
                {
                    fvs_id: 1,
                    fvs_description: 'test',
                    fvs_alias: 'test',
                    fvs_search_parameters: 'test',
                },
                {
                    fvs_id: 2,
                    fvs_description: 'testing',
                    fvs_alias: 'testing',
                    fvs_search_parameters: 'testing',
                },
            ],
        });
        expect(getRows().length).toBe(2);

        fireEvent.click(getByTestId('favourite-search-list-item-0-delete'));
        fireEvent.click(getByTestId('favourite-search-list-item-0-cancel'));

        await waitFor(() => getByTestId('fvs-description-0'), { timeout: 1500 });

        expect(getByTestId('fvs-description-0')).toHaveTextContent('test');
        expect(getByTestId('fvs-alias-0')).toHaveTextContent('test');
    });
});
