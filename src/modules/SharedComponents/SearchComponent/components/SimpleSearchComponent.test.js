import React from 'react';
import { SimpleSearchComponent } from './SimpleSearchComponent';
import { rtlRender, fireEvent, createEvent } from 'test-utils';

jest.mock('config/general', () => ({
    ...jest.requireActual('config/general'),
    MAX_PUBLIC_SEARCH_TEXT_LENGTH: 20,
}));

function setup(testProps = {}) {
    const props = {
        onSearchTextChange: jest.fn(),
        classes: {},

        ...testProps,
    };

    return rtlRender(<SimpleSearchComponent {...props} />);
}

describe('SimpleSearchComponent', () => {
    it('should render default view', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render mobile view', () => {
        const { container, getByRole } = setup({
            showMobileSearchButton: true,
            isInHeader: true,
            classes: {
                mobileHeader: 'mobileHeaderTest',
            },
        });
        fireEvent.click(getByRole('button', { name: 'Click to search eSpace' }));
        expect(container.querySelector('.mobileHeaderTest')).toBeInTheDocument();
    });

    it('should show prefix icon when in header', () => {
        const { container } = setup({
            isInHeader: true,
            showPrefixIcon: true,
            classes: {
                inHeader: 'headerClass',
                searchIconPrefix: 'searchIconPrefix',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render show prefix icon in the search box', () => {
        const { container } = setup({ showPrefixIcon: true });
        expect(container).toMatchSnapshot();
    });

    it('should render with a class "header" for use in AppBar', () => {
        const { container } = setup({ isInHeader: true });
        expect(container).toMatchSnapshot();

        const form = container.querySelector('form');
        const submitEvent = createEvent.submit(form);
        fireEvent(form, submitEvent);
        expect(submitEvent.defaultPrevented).toBe(true);
    });

    it('should set search value from prop', () => {
        const { container } = setup({ showAdvancedSearchButton: true, searchText: 'i feel lucky' });
        expect(container).toMatchSnapshot();
    });

    it('should update search text field', () => {
        const testFn = jest.fn();
        const { getByTestId } = setup({ onSearchTextChange: testFn });
        fireEvent.change(getByTestId('simple-search-input'), { target: { value: 'new search value' } });
        expect(testFn).toHaveBeenCalledWith('new search value');
    });

    it("should not submit search if ENTER wasn't pressed", () => {
        const testMethod = jest.fn();
        const { getByTestId } = setup({ searchText: 'new search value', onSearch: testMethod });
        fireEvent.keyDown(getByTestId('simple-search-input'), { key: 'Escape', code: 27 });
        expect(testMethod).not.toHaveBeenCalled();
    });

    it('should submit search if search text is not null and ENTER is pressed', () => {
        const searchFn = jest.fn();
        const { getByTestId } = setup({
            searchText: 'new search value',
            onSearch: searchFn,
        });
        fireEvent.keyDown(getByTestId('simple-search-input'), { key: 'Enter', code: 13 });
        expect(searchFn).toBeCalled();
    });

    it('should render with default onSearch callback', () => {
        const { container, getByTestId } = setup({
            searchText: 'new search value',
        });
        fireEvent.keyDown(getByTestId('simple-search-input'), { key: 'Enter', code: 13 });
        expect(container).toMatchSnapshot();
    });

    it('should ignore empty search string', () => {
        const searchFn = jest.fn();
        const { getByRole } = setup({
            searchText: ' ',
            onSearch: searchFn,
        });
        fireEvent.click(getByRole('button', { name: 'Click to search eSpace' }));
        expect(searchFn).not.toBeCalled();
    });

    it('should toggle search mode', () => {
        const testToggleFn = jest.fn();
        const { getByRole } = setup({
            showAdvancedSearchButton: true,
            onToggleSearchMode: testToggleFn,
        });
        fireEvent.click(getByRole('button', { name: 'Click to switch to Advanced search' }));
        expect(testToggleFn).toHaveBeenCalled();
    });

    it('should render with default toggle search mode callback', () => {
        const { container, getByRole } = setup({
            showAdvancedSearchButton: true,
        });
        fireEvent.click(getByRole('button', { name: 'Click to switch to Advanced search' }));
        expect(container).toBeInTheDocument();
    });

    it('should toggle mobile search', () => {
        const { getByTestId, getByRole } = setup({
            showMobileSearchButton: true,
            isInHeader: true,
        });
        fireEvent.click(getByRole('button', { name: 'Click to search eSpace' }));
        fireEvent.click(getByTestId('CloseIcon'));
        expect(getByTestId('SearchIcon')).toBeInTheDocument();
    });

    it('searchTextValidationMessage() should return a message for being too long', () => {
        const { getByText } = setup({ searchText: 'this is way way too long' });
        expect(getByText('Must be 20 characters or less')).toBeInTheDocument();
    });
});
