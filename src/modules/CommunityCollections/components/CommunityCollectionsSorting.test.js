import React from 'react';
import CommunityCollectionsSorting from './CommunityCollectionsSorting';
// import { EXPORT_FORMAT_TO_EXTENSION } from 'config/general';

import { locale } from 'locale';

jest.mock('hooks');
// import { userIsAdmin } from 'hooks';
const txt = locale.components.communitiesCollections;
function setup(testProps = {}) {
    const props = {
        classes: {},
        pagingData: {
            from: 1,
            to: 20,
            total: 60,
            per_page: 20,
            current_page: 1,
        },
        sortingData: txt.sorting,
        canUseExport: false,
        location: {},
        disabled: false,
        activeFacets: { filters: {}, ranges: {} },
        onPageSizeChanged: jest.fn(),
        onSortByChanged: jest.fn(),
        onExportPublications: jest.fn(),
        ...testProps,
    };

    return getElement(CommunityCollectionsSorting, props);
}

describe('Community Collections component', () => {
    it('renders with empty paging data', () => {
        const data = {
            from: 0,
            to: 0,
            total: 0,
            current_page: 1,
        };
        const wrapper = setup({ pagingData: data });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders with non-empty community paging data', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders with export dropdown for admin or author', () => {
        const wrapper = setup({ canUseExport: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders with export dropdown hidden', () => {
        const wrapper = setup({ canUseExport: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders with all fields disabled', () => {
        const wrapper = setup({ disabled: true });
        wrapper.find('Select').forEach(option => {
            expect(option.props().disabled).toEqual(true);
        });
    });

    it('renders with non-empty paging data, pageChanged called', () => {
        const testFn = jest.fn();
        const wrapper = setup({ onPageSizeChanged: testFn });
        wrapper
            .find('#pageSize')
            .props()
            .onChange({ target: { value: 50 } });
        expect(testFn).toBeCalled();
    });

    it('renders with non-empty paging data, orderDirectionsChanged called', () => {
        const testFn = jest.fn();
        const testValue = 'test';
        const wrapper = setup({ onSortByChanged: testFn });
        wrapper
            .find('#sortOrder')
            .props()
            .onChange({ target: { value: testValue } });
        expect(testFn).toBeCalled();
    });

    it('renders with non-empty paging data, sortByChanged called', () => {
        const testFn = jest.fn();
        const testValue = 'test';
        const wrapper = setup({ onSortByChanged: testFn });
        wrapper
            .find('#sortBy')
            .props()
            .onChange({ target: { value: testValue } });
        expect(testFn).toBeCalled();
    });

    it('renders will set state on receiving new props', () => {
        const mockUseEffect = jest.spyOn(React, 'useEffect');
        const wrapper = setup({
            initPageLength: 5,
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        mockUseEffect.mockImplementation(f => f());
        wrapper.setProps({
            sortBy: 'Publication date',
            sortDirection: 'test',
            pageSize: 5,
            pagingData: {},
        });

        expect(toJson(wrapper)).toMatchSnapshot();
        mockUseEffect.mockRestore();
    });
});
