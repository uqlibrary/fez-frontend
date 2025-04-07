import React from 'react';
import AdvancedSearchRowInput from './AdvancedSearchRowInput';
import { AdvancedSearchField } from './AdvancedSearchRow';
import { act, render, WithReduxStore, fireEvent, waitFor } from 'test-utils';
import * as repositories from 'repositories';

function setup(testProps = {}) {
    const props = {
        AdvancedSearchField: AdvancedSearchField,
        inputField: {
            type: 'TextField',
            validation: [],
            hint: 'Field hint',
            id: 'any-field',
        },
        searchField: 'all',
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <AdvancedSearchRowInput {...props} />
        </WithReduxStore>,
    );
}

describe('AdvancedSearchRowInput', () => {
    it('should render default component for search field', () => {
        const { getByTestId } = setup({
            onChange: jest.fn(),
        });

        const searchField = getByTestId('any-field-input');

        expect(searchField).toHaveAttribute('aria-invalid', 'false');
        expect(searchField).toHaveAttribute('name', 'search-field-any-field');
        expect(searchField).toHaveAttribute('placeholder', 'Field hint');
    });

    it('should render title with given value and display error for max length', () => {
        const onChangeFn = jest.fn();
        const { getByTestId, getByText } = setup({
            inputField: {
                type: 'TextField',
                hint: 'This is hint for text input',
                validation: ['minLength10Validator'],
                id: 'rek-title',
            },
            searchField: 'rek_title',
            value: 'Test',
            onChange: onChangeFn,
        });

        const searchField = getByTestId('rek-title-input');

        expect(searchField).toHaveAttribute('name', 'search-field-rek-title');
        expect(searchField).toHaveAttribute('aria-invalid', 'true');
        expect(searchField).toHaveAttribute('placeholder', 'This is hint for text input');
        expect(searchField).toHaveAttribute('value', 'Test');
        expect(searchField.closest('div')).toHaveClass('Mui-error');

        expect(getByText('Must be at least 10 characters')).toBeInTheDocument();

        fireEvent.change(searchField, { target: { value: 'Testing' } });

        expect(onChangeFn).toHaveBeenCalledWith('Testing');
    });

    it('should render author id search field with given value', async () => {
        mockApi.onGet(repositories.routes.SEARCH_AUTHOR_LOOKUP_API({ searchQuery: '.*' }).apiUrl).replyOnce(200, {
            data: [
                {
                    id: 111,
                    value: 'Testing',
                    aut_id: 111,
                    aut_org_username: 'uqtest',
                    aut_fname: 'UQ',
                    aut_lname: 'Test',
                },
            ],
        });
        const onChangeFn = jest.fn();
        const { getByTestId, getByText } = setup({
            inputField: {
                type: 'AuthorIdLookup',
                hint: 'Add an author id',
                validation: ['required', 'spacelessMaxLength9Validator'],
                id: 'rek-author-id',
            },
            label: 'Test user (uqtest)',
            searchField: 'rek_author_id',
            value: '12345',
            onChange: onChangeFn,
        });

        const searchField = getByTestId('rek-author-id-input');

        expect(searchField).toHaveAttribute('name', 'search-field-rek-author-id');
        expect(searchField).toHaveAttribute('aria-invalid', 'false');
        expect(searchField).toHaveAttribute('placeholder', 'Add an author id');
        expect(searchField).toHaveAttribute('value', '12345 (Test user (uqtest))');

        act(() => {
            fireEvent.change(getByTestId('rek-author-id-input'), { target: { value: 'Testing' } });
        });
        await waitFor(() => getByTestId('rek-author-id-options'));
        fireEvent.click(getByText('Testing'));

        expect(onChangeFn).toHaveBeenCalledWith(111, 'Testing');
    });

    it('should render author id search field with given value and display error', () => {
        const { getByTestId, getByText } = setup({
            inputField: {
                type: 'AuthorIdLookup',
                hint: 'Add an author id',
                validation: ['required', 'spacelessMaxLength9Validator'],
                id: 'rek-author-id',
            },
            label: 'Test user (uqtest)',
            searchField: 'rek_author_id',
            value: '1234567890',
            onChange: jest.fn(),
        });

        const searchField = getByTestId('rek-author-id-input');

        expect(searchField).toHaveAttribute('name', 'search-field-rek-author-id');
        expect(searchField).toHaveAttribute('aria-invalid', 'true');
        expect(searchField).toHaveAttribute('placeholder', 'Add an author id');
        expect(searchField).toHaveAttribute('value', '1234567890 (Test user (uqtest))');
        expect(searchField.closest('div')).toHaveClass('Mui-error');

        expect(getByText('Must be 9 characters or less')).toBeInTheDocument();
    });

    it('should render error text for required rule', () => {
        const { getByTestId, getByText } = setup({
            inputField: {
                type: 'ContributorIdLookup',
                validation: ['required', 'spacelessMaxLength9Validator'],
                id: 'rek-contributor-id',
                hint: 'Add an contributor id',
            },
            searchField: 'rek_contributor_id',
            value: undefined,
            onChange: jest.fn(),
        });

        const searchField = getByTestId('rek-author-id-input');

        expect(searchField).toHaveAttribute('name', 'search-field-rek-contributor-id');
        expect(searchField).toHaveAttribute('aria-invalid', 'true');
        expect(searchField).toHaveAttribute('placeholder', 'Add an contributor id');
        expect(searchField).toHaveAttribute('value', '');

        expect(getByText('This field is required')).toBeInTheDocument();
    });

    it('should render correct error message for publisher lookup field', () => {
        const { getByTestId, getByText } = setup({
            inputField: {
                type: 'PublisherLookup',
                validation: ['required'],
                id: 'rek-publisher',
                hint: 'Add a publisher',
            },
            value: null,
            onChange: jest.fn(),
        });

        const searchField = getByTestId('rek-publisher-input');

        expect(searchField).toHaveAttribute('name', 'search-field-rek-publisher');
        expect(searchField).toHaveAttribute('aria-invalid', 'true');
        expect(searchField).toHaveAttribute('placeholder', 'Add a publisher');
        expect(searchField).toHaveAttribute('value', '');

        expect(getByText('This field is required')).toBeInTheDocument();
    });

    it('should render correct value for publisher lookup field', () => {
        const { getByTestId } = setup({
            inputField: {
                type: 'PublisherLookup',
                validation: ['required'],
                id: 'rek-publisher',
                hint: 'Add a publisher',
            },
            value: 'Test',
            onChange: jest.fn(),
        });

        const searchField = getByTestId('rek-publisher-input');

        expect(searchField).toHaveAttribute('name', 'search-field-rek-publisher');
        expect(searchField).toHaveAttribute('aria-invalid', 'false');
        expect(searchField).toHaveAttribute('placeholder', 'Add a publisher');
        expect(searchField).toHaveAttribute('value', 'Test');
    });

    it('should render correct input for org unit lookup field', async () => {
        mockApi
            .onGet(
                repositories.routes.SEARCH_KEY_LOOKUP_API({ searchQuery: 'test', searchKey: 'org_unit_name' }).apiUrl,
                repositories.routes.SEARCH_KEY_LOOKUP_API({ searchQuery: 'test', searchKey: 'org_unit_name' }).options,
            )
            .replyOnce(200, { data: [{ value: 'Search org unit test' }, { value: 'Testing org unit input' }] });

        const onChangeFn = jest.fn();
        const { getByTestId, getByText } = setup({
            inputField: {
                type: 'OrgUnitLookup',
                validation: ['required'],
                hint: 'Add your org unit',
                id: 'rek-org-unit',
            },
            value: 'Test',
            onChange: onChangeFn,
        });

        const searchField = getByTestId('rek-org-unit-name-input');

        expect(searchField).toHaveAttribute('name', 'search-field-rek-org-unit');
        expect(searchField).toHaveAttribute('aria-invalid', 'false');
        expect(searchField).toHaveAttribute('placeholder', 'Add your org unit');
        expect(searchField).toHaveAttribute('value', 'Test');

        act(() => {
            fireEvent.change(searchField, { target: { value: 'test' } });
        });
        await waitFor(() => getByTestId('rek-org-unit-name-options'));
        fireEvent.click(getByText('Search org unit test'));

        expect(onChangeFn).toHaveBeenCalledWith('Search org unit test', 'Search org unit test');
    });

    it('should render correct input for thesis type select field and display error', () => {
        const onChangeFn = jest.fn();
        const { getByTestId, getByText } = setup({
            inputField: {
                type: 'ThesisTypeLookup',
                validation: ['requiredList'],
                ariaLabel: 'Select multiple thesis types to search for',
                title: 'Thesis type',
                multiple: true,
                id: 'rek-genre-type',
                selectPrompt: 'Select as many thesis types as you want',
            },
            value: [],
            onChange: onChangeFn,
        });

        const searchField = getByTestId('rek-genre-type-select');
        const searchFieldError = getByTestId('rek-genre-type-helper-text');

        expect(searchField).toHaveTextContent('Select as many thesis types as you want');

        expect(searchFieldError).toHaveTextContent('This field is required');
        expect(searchFieldError).toHaveClass('Mui-error');

        fireEvent.mouseDown(getByTestId('rek-genre-type-select'));
        fireEvent.click(getByText('B.A. Thesis'));

        expect(onChangeFn).toHaveBeenCalledWith(['B.A. Thesis'], ['B.A. Thesis']);
    });

    it('should render correct input for thesis type select field with given values', () => {
        const { getByTestId } = setup({
            inputField: {
                type: 'ThesisTypeLookup',
                validation: ['requiredList'],
                ariaLabel: 'Select multiple thesis types to search for',
                title: 'Thesis type',
                multiple: true,
                selectPrompt: 'Select as many thesis types as you want',
            },
            value: ['B.A. Thesis'],
            onChange: jest.fn(),
        });

        expect(getByTestId('rek-genre-type-select')).toHaveTextContent('B.A. Thesis');
    });

    it('should render correct input for collection lookup field', () => {
        const { getByTestId, getByText } = setup({
            inputField: {
                type: 'CollectionsLookup',
                validation: ['requiredList'],
                ariaLabel: 'Select multiple collections to search for',
                multiple: true,
                hint: 'Select multiple collections to search for',
                collectionFieldId: 'rek-ismemberof',
            },
            value: [],
            onChange: jest.fn(),
        });

        const searchField = getByTestId('rek-ismemberof-input');

        expect(searchField).toHaveAttribute('aria-invalid', 'true');
        expect(searchField).toHaveAttribute('placeholder', 'Select multiple collections to search for');
        expect(searchField.closest('div')).toHaveClass('Mui-error');
        expect(getByText('This field is required')).toBeInTheDocument();
    });

    it('should render correct input for publication status field', () => {
        const onChangeFn = jest.fn();
        const { getByTestId, getByText } = setup({
            inputField: {
                type: 'StatusLookup',
                validation: ['required'],
                ariaLabel: 'Select status to search for',
                title: 'Status',
                multiple: false,
                isUnpublishedField: true,
                id: 'rek-status',
                selectPrompt: 'Please select a status',
            },
            value: '',
            onChange: onChangeFn,
        });

        expect(getByTestId('rek-status-select')).toHaveTextContent('Please select a status');
        expect(getByTestId('rek-status-helper-text')).toHaveTextContent('This field is required');
        expect(getByTestId('rek-status-helper-text')).toHaveClass('Mui-error');

        fireEvent.mouseDown(getByTestId('rek-status-select'));

        act(() => {
            fireEvent.click(getByText('Unpublished'));
        });

        expect(onChangeFn).toHaveBeenCalledWith('Unpublished');
    });

    it('should render default text field if field is not in the list', () => {
        const { getByTestId } = setup({
            inputField: {
                type: 'StrangeLookup',
                validation: ['required'],
                textFieldId: 'test',
            },
            value: 'test',
            onChange: jest.fn(),
        });

        expect(getByTestId('text-field-input')).toBeInTheDocument();
        expect(getByTestId('text-field-input')).toHaveAttribute('name', 'search-field-text-field');
        expect(getByTestId('text-field-input')).toHaveAttribute('value', 'test');
    });
});
