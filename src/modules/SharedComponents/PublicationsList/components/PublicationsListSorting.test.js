jest.dontMock('./PublicationsListSorting');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import PublicationsListSorting from './PublicationsListSorting';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {locale} from 'config';

function setup({onPageSizeChanged, onSortByChanged, disabled, pagingData, isShallow = true}) {
    const defaultPagingData = {
        from: 1,
        to: 20,
        total: 60,
        per_page: 20,
        current_page: 1
    };

    const props = {
        pagingData: pagingData || defaultPagingData,
        disabled: disabled || false,
        onPageSizeChanged: onPageSizeChanged || jest.fn(),
        onSortByChanged: onSortByChanged || jest.fn()
    };

    if(isShallow) {
        return shallow(<PublicationsListSorting {...props} />);
    }

    return mount(<PublicationsListSorting {...props} />, {
        context: {
            muiTheme: getMuiTheme()
        },
        childContextTypes: {
            muiTheme: PropTypes.object.isRequired
        }
    });
}

beforeAll(() => {
    injectTapEventPlugin();
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

    // it('component with non-empty paging data, second page', () => {
    //     const data = {
    //         from: 21,
    //         to: 40,
    //         total: 60,
    //         per_page: 20,
    //         current_page: 2
    //     };
    //     const wrapper = setup({pagingData: data});
    //     expect(toJson(wrapper)).toMatchSnapshot();
    //
    //     const pages = wrapper.find('.publicationsListSorting .page');
    //     expect(pages.length).toBe(3);
    //
    //     const selectedPage = wrapper.find('.publicationsListSorting .page.selectedPage');
    //     expect(selectedPage.length).toBe(1);
    //     expect(selectedPage.props().label).toBe(2);
    //
    //     const nextPage = wrapper.find('.pagingNext');
    //     expect(nextPage.length).toBe(1);
    //
    //     const previousPage = wrapper.find('.pagingPrevious');
    //     expect(previousPage.length).toBe(1);
    // });
    //
    // it('component with non-empty paging data, last page', () => {
    //     const data = {
    //         from: 41,
    //         to: 60,
    //         total: 60,
    //         per_page: 20,
    //         current_page: 3
    //     };
    //     const wrapper = setup({pagingData: data});
    //     expect(toJson(wrapper)).toMatchSnapshot();
    //
    //     const pages = wrapper.find('.publicationsListSorting .page');
    //     expect(pages.length).toBe(3);
    //
    //     const selectedPage = wrapper.find('.publicationsListSorting .page.selectedPage');
    //     expect(selectedPage.length).toBe(1);
    //     expect(selectedPage.props().label).toBe(3);
    //
    //     const nextPage = wrapper.find('.pagingNext');
    //     expect(nextPage.length).toBe(0);
    //
    //     const previousPage = wrapper.find('.pagingPrevious');
    //     expect(previousPage.length).toBe(1);
    // });
    //

    //
    // it('component with non-empty paging data, pageChanged called', () => {
    //     const data = {
    //         from: 1,
    //         to: 20,
    //         total: 60,
    //         per_page: 20,
    //         current_page: 1
    //     };
    //     const testFunction = jest.fn();
    //     const wrapper = setup({pagingData: data, onPageChanged: testFunction, isShallow: false});
    //     wrapper.instance().pageChanged();
    //     expect(testFunction).toBeCalled();
    // });
    //
    // it('component with non-empty paging data, next page clicked', () => {
    //     const data = {
    //         from: 1,
    //         to: 20,
    //         total: 60,
    //         per_page: 20,
    //         current_page: 1
    //     };
    //     const testFunction = jest.fn();
    //     const wrapper = setup({pagingData: data, onPageChanged: testFunction, isShallow: false});
    //
    //     const nextPage = wrapper.find('.pagingNext');
    //     expect(nextPage.length).toBe(1);
    //     nextPage.props().onTouchTap();
    //     expect(testFunction).toBeCalled();
    // });
    //
    // it('component with non-empty paging data, previous page clicked', () => {
    //     const data = {
    //         from: 21,
    //         to: 40,
    //         total: 60,
    //         per_page: 20,
    //         current_page: 2
    //     };
    //     const testFunction = jest.fn();
    //     const wrapper = setup({pagingData: data, onPageChanged: testFunction, isShallow: false});
    //
    //     const page = wrapper.find('.pagingPrevious');
    //     expect(page.length).toBe(1);
    //     page.props().onTouchTap();
    //     expect(testFunction).toBeCalled();
    // });
    //
    // it('component with non-empty paging data, page number is clicked', () => {
    //     const data = {
    //         from: 1,
    //         to: 20,
    //         total: 60,
    //         per_page: 20,
    //         current_page: 1
    //     };
    //     const testFunction = jest.fn();
    //     const wrapper = setup({pagingData: data, onPageChanged: testFunction, isShallow: false});
    //     const pages = wrapper.find('.publicationsListSorting .page');
    //     pages.at(1).props().onTouchTap();
    //     expect(testFunction).toBeCalled();
    // });
    //
    // it('component with non-empty paging data, state is updated', () => {
    //     const data = {
    //         from: 1,
    //         to: 20,
    //         total: 60,
    //         per_page: 20,
    //         current_page: 1
    //     };
    //
    //     const nextData = {
    //         from: 21,
    //         to: 40,
    //         total: 60,
    //         per_page: 20,
    //         current_page: 2
    //     };
    //     const testFunction = jest.fn();
    //     const wrapper = setup({pagingData: data, onPageChanged: testFunction, isShallow: false});
    //     wrapper.instance().componentWillReceiveProps({pagingData: nextData});
    //     expect(JSON.stringify(wrapper.state())).toBe(JSON.stringify(nextData));
    //
    //     wrapper.instance().componentWillReceiveProps({pagingData: {}, disabled: true});
    //     expect(JSON.stringify(wrapper.state())).toBe(JSON.stringify(nextData));
    // });
});
