jest.dontMock('./YearPublishedFacetRange');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import {possibleUnclaimedList} from 'mock/data';

import YearPublishedFacetRange from './YearPublishedFacetRange';

function setup({onChange = jest.fn(), activeFacets = {filters: {}, ranges: {}}, disabled = false, minYearValue = 2010, maxYearValue = 2020, index = 0}) {
    const props = {
        onChange,
        activeFacets,
        minYearValue,
        maxYearValue,
        index,
        disabled
    };

    return shallow(<YearPublishedFacetRange {...props} />);
}

describe('YearPublishedFacetRange renders ', () => {

    beforeEach(() => {
        // Set a mock date for account API
        const DATE_TO_USE = new Date('2016');
        const _Date = Date;
        global.Date = jest.fn(() => DATE_TO_USE);
        global.Date.UTC = _Date.UTC;
        global.Date.parse = _Date.parse;
        global.Date.now = _Date.now;
    });

    it('range selector with default values populated', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();

        const yearPublishedCategory = wrapper.find('.facetsYear');
        expect(yearPublishedCategory.length).toEqual(1);
    });

    it('range descriptor when active', () => {
        const wrapper = setup({activeFacets: {filters: {}, ranges: {'Year published': '2010 - 2016'}}});
        expect(toJson(wrapper)).toMatchSnapshot();

        const yearPublishedCategory = wrapper.find('.facetsYear .active');
        expect(yearPublishedCategory.length).toEqual(1);
    });

    it('range selector as disabled', () => {
        const wrapper = setup({disabled: true});
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.find('.facetsYearCategory').forEach(item => {
            expect(item.props().disabled).toEqual(true);
        });
    });

    it('category for mock data deactivating a range selection', () => {
        const testHandleFacetClickFn = jest.fn();
        const wrapper = setup({onChange: testHandleFacetClickFn, activeFacets: {filters: {}, ranges: {'Year published': '2010 - 2018'}}});

        wrapper.instance()._handleRangeFacetClick();
        wrapper.update();
        expect(testHandleFacetClickFn).toHaveBeenCalledWith('Year published', '[2010 TO 2018]', 'ranges');
    });

    it('category for mock data activating a range selection', () => {
        const testHandleFacetClickFn = jest.fn();
        const wrapper = setup({onChange: testHandleFacetClickFn, minYearValue: 2000, maxYearValue: 2010, activeFacets: {filters: {}, ranges: {}}});

        wrapper.instance()._handleRangeFacetClick();
        wrapper.update();
        expect(testHandleFacetClickFn).toHaveBeenCalledWith('Year published', '[2000 TO 2010]', 'ranges');

        wrapper.instance()._handleRangeFacetClick();
        wrapper.update();
        expect(testHandleFacetClickFn).toHaveBeenCalledWith('Year published', '[2000 TO 2010]', 'ranges');

        wrapper.instance().setFromValue({}, '2005');
        wrapper.instance().setToValue({}, '2015');
        wrapper.instance()._handleRangeFacetClick();
        wrapper.update();
        expect(testHandleFacetClickFn).toHaveBeenCalledWith('Year published', '[2005 TO 2015]', 'ranges');
    });

    it('category for mock data activating a range (* - 2020)', () => {
        const testHandleFacetClickFn = jest.fn();
        const wrapper = setup({onChange: testHandleFacetClickFn, minYearValue: 2000, maxYearValue: 2010, activeFacets: {filters: {}, ranges: {}}});

        wrapper.instance().setFromValue({});
        wrapper.instance().setToValue({}, '2020');
        wrapper.instance()._handleRangeFacetClick();
        wrapper.update();
        expect(testHandleFacetClickFn).toHaveBeenCalledWith('Year published', '[* TO 2020]', 'ranges');
    });

    it('category for mock data activating a range (2010 - *)', () => {
        const testHandleFacetClickFn = jest.fn();
        const wrapper = setup({onChange: testHandleFacetClickFn, minYearValue: 2000, maxYearValue: 2010, activeFacets: {filters: {}, ranges: {}}});

        wrapper.instance().setFromValue({}, '2010');
        wrapper.instance().setToValue({});
        wrapper.instance()._handleRangeFacetClick();
        wrapper.update();
        expect(testHandleFacetClickFn).toHaveBeenCalledWith('Year published', '[2010 TO *]', 'ranges');
    });

    it('category for mock data activating a range (0500 - 2020)', () => {
        const testHandleFacetClickFn = jest.fn();
        const wrapper = setup({onChange: testHandleFacetClickFn, minYearValue: 2000, maxYearValue: 2010, activeFacets: {filters: {}, ranges: {}}});

        wrapper.instance().setFromValue({}, '500');
        wrapper.instance().setToValue({}, '2020');
        wrapper.instance()._handleRangeFacetClick();
        wrapper.update();
        expect(testHandleFacetClickFn).toHaveBeenCalledWith('Year published', '[0500 TO 2020]', 'ranges');
    });

    it('category for mock data activating a range swapped (2020 - 2015)', () => {
        const testHandleFacetClickFn = jest.fn();
        const wrapper = setup({onChange: testHandleFacetClickFn, minYearValue: 2000, maxYearValue: 2010, activeFacets: {filters: {}, ranges: {}}});

        wrapper.instance().setFromValue({}, '2020');
        wrapper.instance().setToValue({}, '2015');
        wrapper.instance()._handleRangeFacetClick();
        wrapper.update();
        expect(testHandleFacetClickFn).toHaveBeenCalledWith('Year published', '[2015 TO 2020]', 'ranges');
    });
});
