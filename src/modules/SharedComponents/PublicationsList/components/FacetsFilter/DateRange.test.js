jest.dontMock('./DateRange');

import DateRange from './DateRange';
import {possibleUnclaimedList} from 'mock/data';

function setup(testProps, isShallow = true) {
    const props = {
        onChange: jest.fn(),
        disabled: false,
        defaultValue: {from: 2010, to: 2020},
        open: null,
        value: {from: null, to: null},
        locale: {
            displayTitle: 'Published year range',
            fromFieldLabel: 'From',
            toFieldLabel: 'To',
            rangeSubmitButtonLabel: 'Go'
        },
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
        const wrapper = setup({activeFacets: {filters: {}, ranges: {}}});
        expect(toJson(wrapper)).toMatchSnapshot();

        const yearPublishedCategory = wrapper.find('.dateRange');
        expect(yearPublishedCategory.length).toEqual(1);
    });

    it('should render range descriptor when active', () => {
        const wrapper = setup({open: true, value: {from: 2010, to: 2016}});
        expect(toJson(wrapper)).toMatchSnapshot();

        const yearPublishedCategory = wrapper.find('.dateRange .active');
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
        const wrapper = setup({onChange: testHandleFacetClickFn, value: {from: 2010, to: 2018}});

        wrapper.instance()._handleRangeFacetClick();
        wrapper.update();
        expect(testHandleFacetClickFn).toHaveBeenCalledWith({from: 2010, to: 2018});
    });

    it('should handle facet click correctly on changing year published range values', () => {
        const testHandleFacetClickFn = jest.fn();
        const wrapper = setup({onChange: testHandleFacetClickFn, defaultValue: {from: 2000, to: 2010}});

        wrapper.instance()._handleRangeFacetClick();
        wrapper.update();
        expect(testHandleFacetClickFn).toHaveBeenCalledWith({from: 2000, to: 2010});

        wrapper.instance()._handleRangeFacetClick();
        wrapper.update();
        expect(testHandleFacetClickFn).toHaveBeenCalledWith({from: 2000, to: 2010});

        wrapper.instance().setValue('from')({}, '2005');
        wrapper.instance().setValue('to')({}, '2015');
        wrapper.instance()._handleRangeFacetClick();
        wrapper.update();
        expect(testHandleFacetClickFn).toHaveBeenCalledWith({from: 2005, to: 2015});
    });

    it('should render category on facet click for a range (* - 2020)', () => {
        const testHandleFacetClickFn = jest.fn();
        const wrapper = setup({onChange: testHandleFacetClickFn, defaultValue: {from: 2000, to: 2010}});

        wrapper.instance().setValue('from')({});
        wrapper.instance().setValue('to')({}, '2020');
        wrapper.instance()._handleRangeFacetClick();
        wrapper.update();
        expect(testHandleFacetClickFn).toHaveBeenCalledWith({from: null, to: 2020});
    });

    it('should render category on facet click for a range (2010 - *)', () => {
        const testHandleFacetClickFn = jest.fn();
        const wrapper = setup({onChange: testHandleFacetClickFn, defaultValue: {from: 2000, to: 2010}});

        wrapper.instance().setValue('from')({}, '2010');
        wrapper.instance().setValue('to')({});
        wrapper.instance()._handleRangeFacetClick();
        wrapper.update();
        expect(testHandleFacetClickFn).toHaveBeenCalledWith({from: 2010, to: null});
    });

    it('should render category on facet click for a range (0500 - 2020)', () => {
        const testHandleFacetClickFn = jest.fn();
        const wrapper = setup({onChange: testHandleFacetClickFn, defaultValue: {from: 2000, to: 2010}});

        wrapper.instance().setValue('from')({}, '500');
        wrapper.instance().setValue('to')({}, '2020');
        wrapper.instance()._handleRangeFacetClick();
        wrapper.update();
        expect(testHandleFacetClickFn).toHaveBeenCalledWith({from: 500, to: 2020});
    });

    it('should render category with years swapped on facet click for a range (2020 - 2015)', () => {
        const testHandleFacetClickFn = jest.fn();
        const wrapper = setup({onChange: testHandleFacetClickFn, defaultValue: {from: 2000, to: 2010}});

        wrapper.instance().setValue('from')({}, '2020');
        wrapper.instance().setValue('to')({}, '2015');
        wrapper.instance()._handleRangeFacetClick();
        wrapper.update();
        expect(testHandleFacetClickFn).toHaveBeenCalledWith({from: 2020, to: 2015});
    });
});
