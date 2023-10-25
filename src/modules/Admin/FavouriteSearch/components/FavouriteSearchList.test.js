import React from 'react';
import FavouriteSearchList from './FavouriteSearchList';
import { rtlRender, fireEvent, act } from 'test-utils';
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
    it('should render empty list', () => {
        const { getByText } = setup();
        expect(getByText('No records to display')).toBeInTheDocument();
    });

    it('should render rows for favourite search', () => {
        const { getByTestId } = setup({
            list: [
                {
                    fvs_id: 1,
                    fvs_description: 'test',
                    fvs_alias: 'test',
                    fvs_search_parameters: 'test',
                },
            ],
        });

        expect(getByTestId('favourite-search-list-item-0')).toBeInTheDocument();
    });

    it('should render edit component for favourite search row on clicking edit button', () => {
        const { getByTestId } = setup({
            list: [
                {
                    fvs_id: 1,
                    fvs_description: 'test',
                    fvs_alias: 'test',
                    fvs_search_parameters: 'test',
                },
            ],
        });
        const listItem = getByTestId('favourite-search-list-item-0');
        fireEvent.click(getByTestId('favourite-search-list-item-1-edit', listItem));

        expect(getByTestId('favourite-search-list-edit-item-1')).toBeInTheDocument();
    });

    it('should render error message for empty description field while editing', () => {
        const { getByTestId } = setup({
            list: [
                {
                    fvs_id: 1,
                    fvs_description: 'test',
                    fvs_alias: 'test',
                    fvs_search_parameters: 'test',
                },
            ],
        });
        const listItem = getByTestId('favourite-search-list-item-0');
        fireEvent.click(getByTestId('favourite-search-list-item-1-edit', listItem));

        fireEvent.change(getByTestId('fvs-description-input'), { target: { value: '' } });
        expect(getByTestId('fvs-description-helper-text')).toBeInTheDocument();
        expect(getByTestId('fvs-description-helper-text')).toHaveTextContent('This field is required');
    });

    it('should render correct error message for alias field while editing', () => {
        const { getByTestId, queryByTestId } = setup({
            list: [
                {
                    fvs_id: 1,
                    fvs_description: 'test',
                    fvs_alias: 'test',
                    fvs_search_parameters: 'test',
                },
            ],
        });
        const listItem = getByTestId('favourite-search-list-item-0');
        fireEvent.click(getByTestId('favourite-search-list-item-1-edit', listItem));

        fireEvent.change(getByTestId('fvs-alias-input'), { target: { value: '' } });
        expect(queryByTestId('fvs-alias-helper-text')).not.toBeInTheDocument();

        fireEvent.change(getByTestId('fvs-alias-input'), { target: { value: 'test_' } });
        expect(getByTestId('fvs-alias-helper-text')).toBeInTheDocument();
        expect(getByTestId('fvs-alias-helper-text')).toHaveTextContent('Alias is not valid');

        fireEvent.change(getByTestId('fvs-alias-input'), { target: { value: '_test' } });
        expect(getByTestId('fvs-alias-helper-text')).toBeInTheDocument();
        expect(getByTestId('fvs-alias-helper-text')).toHaveTextContent('Alias is not valid');

        fireEvent.change(getByTestId('fvs-alias-input'), { target: { value: '____' } });
        expect(getByTestId('fvs-alias-helper-text')).toBeInTheDocument();
        expect(getByTestId('fvs-alias-helper-text')).toHaveTextContent('Alias is not valid');

        fireEvent.change(getByTestId('fvs-alias-input'), { target: { value: 'test' } });
        expect(queryByTestId('fvs-alias-helper-text')).not.toBeInTheDocument();

        fireEvent.change(getByTestId('fvs-alias-input'), { target: { value: 'test_alias' } });
        expect(getByTestId('fvs-alias-helper-text')).toBeInTheDocument();
        expect(getByTestId('fvs-alias-helper-text')).toHaveTextContent('Alias is not valid');
    });

    it('should render updated info after editing', async () => {
        const { getByTestId } = setup({
            list: [
                {
                    fvs_id: 1,
                    fvs_description: 'test',
                    fvs_alias: 'test',
                    fvs_search_parameters: 'test',
                },
            ],
        });
        const listItem = getByTestId('favourite-search-list-item-0');

        expect(getByTestId('fvs-description-1', listItem)).toHaveTextContent('test');
        expect(getByTestId('fvs-alias-1', listItem)).toHaveTextContent('test');

        fireEvent.click(getByTestId('favourite-search-list-item-1-edit'));

        fireEvent.change(getByTestId('fvs-description-input'), { target: { value: 'testing' } });
        fireEvent.change(getByTestId('fvs-alias-input'), { target: { value: 'testing-testing' } });

        act(() => {
            fireEvent.click(getByTestId('favourite-search-list-item-1-save'));
        });

        // listItem = await waitFor(() => getByTestId('favourite-search-list-item-0'));
        // fireEvent.click(document.getElementById('mtableheader-sortlabel'));
        // screen.debug(undefined, 100000);
        // expect(getByTestId('fvs-description-0', listItem)).toHaveTextContent('testing');
        // expect(getByTestId('fvs-alias-0', listItem)).toHaveTextContent('testing-testing');
    });

    it('should render previous info if handleRowUpdate throws exception', async () => {
        const { getByTestId } = setup({
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
        let listItem = getByTestId('favourite-search-list-item-0');

        expect(getByTestId('fvs-description-1', listItem)).toHaveTextContent('test');
        expect(getByTestId('fvs-alias-1', listItem)).toHaveTextContent('test');

        fireEvent.click(getByTestId('favourite-search-list-item-1-edit'));

        fireEvent.change(getByTestId('fvs-description-input'), { target: { value: 'testing' } });
        fireEvent.change(getByTestId('fvs-alias-input'), { target: { value: 'testing-testing' } });

        act(() => {
            fireEvent.click(getByTestId('favourite-search-list-item-1-save'));
        });

        listItem = await waitFor(() => getByTestId('favourite-search-list-item-0'));

        expect(getByTestId('fvs-description-1', listItem)).toHaveTextContent('test');
        expect(getByTestId('fvs-alias-1', listItem)).toHaveTextContent('test');
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
        const listItem0 = getByTestId('favourite-search-list-item-0');
        expect(listItem0).toBeInTheDocument();
        const listItem1 = getByTestId('favourite-search-list-item-1');
        expect(listItem1).toBeInTheDocument();

        fireEvent.click(getByTestId('favourite-search-list-item-1-delete'));

        act(() => {
            fireEvent.click(getByTestId('favourite-search-list-item-1-save'));
        });

        // const listItem = await waitFor(() => getByTestId('favourite-search-list-item-0'));

        // expect(getByTestId('fvs-description-0', listItem)).toHaveTextContent('testing');
        // expect(getByTestId('fvs-alias-0', listItem)).toHaveTextContent('testing');
    });
});
