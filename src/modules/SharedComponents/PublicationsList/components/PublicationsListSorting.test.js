jest.dontMock('./PublicationsListSorting');

import toJson from 'enzyme-to-json';
import React from 'react';
import PublicationsListSorting from './PublicationsListSorting';
import {exportFormatToExtension} from '../../../../config/general';

function setup(testProps, isShallow = true) {
    const props = {
        pagingData: {
            from: 1,
            to: 20,
            total: 60,
            per_page: 20,
            current_page: 1
        },
        disabled: false,
        activeFacets: {filters: {}, ranges: {}},
        onPageSizeChanged: jest.fn(),
        onSortByChanged: jest.fn(),
        onExportPublications: jest.fn(),
        ...testProps
    };

    return getElement(PublicationsListSorting, props, isShallow);
}

beforeAll(() => {
    
});

describe('PublicationsListSorting renders ', () => {
    it('component with empty paging data', () => {
        const data = {
            from: 0,
            to: 0,
            total: 0,
            per_page: 20,
            current_page: 1
        };
        const wrapper = setup({pagingData: data});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.publicationsListSorting.empty').length).toBe(1);
    });

    it('component with non-empty paging data', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.publicationsListSorting.empty').length).toBe(0);
        const pages = wrapper.find('SelectField');
        expect(pages.length).toBe(3);
    });


    it('component with all fields disabled', () => {
        const wrapper = setup({disabled: true});
        wrapper.find('SelectField').forEach(option => {
            expect(option.props().disabled).toEqual(true);
        })
    });

    it('component with non-empty paging data, pageChanged called', () => {
        const testFunction = jest.fn();
        const testValue = 1000;
        const wrapper = setup({onPageSizeChanged: testFunction});
        wrapper.instance().pageSizeChanged(null, null, testValue);
        expect(wrapper.state().pageSize).toEqual(testValue);
        expect(testFunction).toBeCalled();
    });

    it('component with non-empty paging data, orderDirectionsChanged called', () => {
        const testFunction = jest.fn();
        const testValue = 'test';
        const wrapper = setup({onSortByChanged: testFunction});
        wrapper.instance().orderDirectionsChanged(null, null, testValue);
        expect(wrapper.state().sortDirection).toEqual(testValue);
        expect(testFunction).toBeCalled();
    });

    it('component with non-empty paging data, sortByChanged called', () => {
        const testFunction = jest.fn();
        const testValue = 'test';
        const wrapper = setup({onSortByChanged: testFunction});
        wrapper.instance().sortByChanged(null, null, testValue);
        expect(wrapper.state().sortBy).toEqual(testValue);
        expect(testFunction).toBeCalled();
    });

    it('component with non-empty paging data, onExportPublications called', () => {
        const expected = Object.keys(exportFormatToExtension)[0];
        const testFunction = jest.fn();
        const wrapper = setup({onExportPublications: testFunction, location: {state: {activeFacets: {filters: {}, ranges: {}}}}});
        wrapper.instance().exportPublicationsFormatChanged(expected);
        expect(wrapper.state().exportPublicationsFormat).toEqual(expected);
        expect(testFunction).toHaveBeenCalledWith({exportPublicationsFormat: expected, ...wrapper.instance().state, activeFacets: wrapper.instance().props.activeFacets});
    });
});
