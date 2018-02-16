jest.dontMock('./DateRange');

import DateRange from './DateRange';
import {possibleUnclaimedList} from 'mock/data';

function setup(testProps, isShallow = true) {
    const props = {
        onChange: jest.fn(),
        disabled: false,
        minYearValue: 2010,
        maxYearValue: 2020,
        index: 0,
        open: null,
        isActive: false,
        title: 'Year published',
        displayTitle: 'Published year range',
        facetValueOnActive: {from: null, to: null},
        ...testProps
    };
    return getElement(DateRange, props, isShallow);
}

describe('Date range ', () => {

    beforeEach(() => {
        // Set a mock date for account API
        const DATE_TO_USE = new Date('2016');
        const _Date = Date;
        global.Date = jest.fn(() => DATE_TO_USE);
        global.Date.UTC = _Date.UTC;
        global.Date.parse = _Date.parse;
        global.Date.now = _Date.now;
    });

    it('should render range selector with default values populated', () => {
        const wrapper = setup({minYearValue: 2010, maxYearValue: 2020, activeFacets: {filters: {}, ranges: {}}});
        expect(toJson(wrapper)).toMatchSnapshot();

        const yearPublishedCategory = wrapper.find('.facetsYear');
        expect(yearPublishedCategory.length).toEqual(1);
    });

    it('should render range descriptor when active', () => {
        const wrapper = setup({isActive: true, open: true, facetValueOnActive: {from: '2010', to: '2016'}});
        expect(toJson(wrapper)).toMatchSnapshot();

        const yearPublishedCategory = wrapper.find('.facetsYear .active');
        expect(yearPublishedCategory.length).toEqual(1);
    });

    it('should render range selector disabled', () => {
        const wrapper = setup({disabled: true});
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.find('.facetsYearCategory').forEach(item => {
            expect(item.props().disabled).toEqual(true);
        });
    });

    it('should handle facet click correctly on deactivating year published range', () => {
        const testHandleFacetClickFn = jest.fn();
        const wrapper = setup({onChange: testHandleFacetClickFn, facetValueOnActive: {from: '2010', to: '2018'}});

        wrapper.instance()._handleRangeFacetClick();
        wrapper.update();
        expect(testHandleFacetClickFn).toHaveBeenCalledWith('Year published', '2010', '2018');
    });

    it('should handle facet click correctly on changing year published range values', () => {
        const testHandleFacetClickFn = jest.fn();
        const wrapper = setup({onChange: testHandleFacetClickFn, minYearValue: 2000, maxYearValue: 2010});

        wrapper.instance()._handleRangeFacetClick();
        wrapper.update();
        expect(testHandleFacetClickFn).toHaveBeenCalledWith('Year published', 2000, 2010);

        wrapper.instance()._handleRangeFacetClick();
        wrapper.update();
        expect(testHandleFacetClickFn).toHaveBeenCalledWith('Year published', 2000, 2010);

        wrapper.instance().setFromValue({}, '2005');
        wrapper.instance().setToValue({}, '2015');
        wrapper.instance()._handleRangeFacetClick();
        wrapper.update();
        expect(testHandleFacetClickFn).toHaveBeenCalledWith('Year published', '2005', '2015');
    });

    it('should render category on facet click for a range (* - 2020)', () => {
        const testHandleFacetClickFn = jest.fn();
        const wrapper = setup({onChange: testHandleFacetClickFn, minYearValue: 2000, maxYearValue: 2010});

        wrapper.instance().setFromValue({});
        wrapper.instance().setToValue({}, '2020');
        wrapper.instance()._handleRangeFacetClick();
        wrapper.update();
        expect(testHandleFacetClickFn).toHaveBeenCalledWith('Year published', undefined, '2020');
    });

    it('should render category on facet click for a range (2010 - *)', () => {
        const testHandleFacetClickFn = jest.fn();
        const wrapper = setup({onChange: testHandleFacetClickFn, minYearValue: 2000, maxYearValue: 2010});

        wrapper.instance().setFromValue({}, '2010');
        wrapper.instance().setToValue({});
        wrapper.instance()._handleRangeFacetClick();
        wrapper.update();
        expect(testHandleFacetClickFn).toHaveBeenCalledWith('Year published', '2010', undefined);
    });

    it('should render category on facet click for a range (0500 - 2020)', () => {
        const testHandleFacetClickFn = jest.fn();
        const wrapper = setup({onChange: testHandleFacetClickFn, minYearValue: 2000, maxYearValue: 2010});

        wrapper.instance().setFromValue({}, '500');
        wrapper.instance().setToValue({}, '2020');
        wrapper.instance()._handleRangeFacetClick();
        wrapper.update();
        expect(testHandleFacetClickFn).toHaveBeenCalledWith('Year published', '0500', '2020');
    });

    it('should render category with years swapped on facet click for a range (2020 - 2015)', () => {
        const testHandleFacetClickFn = jest.fn();
        const wrapper = setup({onChange: testHandleFacetClickFn, minYearValue: 2000, maxYearValue: 2010});

        wrapper.instance().setFromValue({}, '2020');
        wrapper.instance().setToValue({}, '2015');
        wrapper.instance()._handleRangeFacetClick();
        wrapper.update();
        expect(testHandleFacetClickFn).toHaveBeenCalledWith('Year published', '2020', '2015');
    });
});
