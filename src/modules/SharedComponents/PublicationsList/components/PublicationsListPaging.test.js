jest.dontMock('./PublicationsListPaging');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import PublicationsListPaging from './PublicationsListPaging';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';


function setup({onPageChanged, disabled, pagingData, isShallow = true}) {
    const defaultPagingData = {
        from: 0,
        to: 0,
        total: 0,
        per_page: 20,
        current_page: 1
    };

    const props = {
        pagingData: pagingData || defaultPagingData,
        disabled: disabled || false,
        onPageChanged: onPageChanged || jest.fn()
    };

    if(isShallow) {
        return shallow(<PublicationsListPaging {...props} />);
    }

    return mount(<PublicationsListPaging {...props} />, {
        context: {
            muiTheme: getMuiTheme()
        },
        childContextTypes: {
            muiTheme: PropTypes.object.isRequired
        }
    });
}

beforeAll(() => {

});

describe('PublicationsListPaging renders ', () => {
    it('component with empty paging data', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.publicationsListControls.empty').length).toBe(1);
    });

    it('component with non-empty paging data, first page', () => {
        const data = {
            from: 1,
            to: 20,
            total: 60,
            per_page: 20,
            current_page: 1
        };
        const wrapper = setup({pagingData: data});
        expect(toJson(wrapper)).toMatchSnapshot();

        const pages = wrapper.find('.publicationsListPaging .page');
        expect(pages.length).toBe(3);

        const selectedPage = wrapper.find('.publicationsListPaging .page.selectedPage');
        expect(selectedPage.length).toBe(1);
        expect(selectedPage.props().label).toBe(1);

        const nextPage = wrapper.find('.pagingNext');
        expect(nextPage.length).toBe(1);

        const previousPage = wrapper.find('.pagingPrevious');
        expect(previousPage.length).toBe(1);
    });

    it('component with non-empty paging data, second page', () => {
        const data = {
            from: 21,
            to: 40,
            total: 60,
            per_page: 20,
            current_page: 2
        };
        const wrapper = setup({pagingData: data});
        expect(toJson(wrapper)).toMatchSnapshot();

        const pages = wrapper.find('.publicationsListPaging .page');
        expect(pages.length).toBe(3);

        const selectedPage = wrapper.find('.publicationsListPaging .page.selectedPage');
        expect(selectedPage.length).toBe(1);
        expect(selectedPage.props().label).toBe(2);

        const nextPage = wrapper.find('.pagingNext');
        expect(nextPage.length).toBe(1);

        const previousPage = wrapper.find('.pagingPrevious');
        expect(previousPage.length).toBe(1);
    });

    it('component with non-empty paging data, last page', () => {
        const data = {
            from: 41,
            to: 60,
            total: 60,
            per_page: 20,
            current_page: 3
        };
        const wrapper = setup({pagingData: data});
        expect(toJson(wrapper)).toMatchSnapshot();

        const pages = wrapper.find('.publicationsListPaging .page');
        expect(pages.length).toBe(3);

        const selectedPage = wrapper.find('.publicationsListPaging .page.selectedPage');
        expect(selectedPage.length).toBe(1);
        expect(selectedPage.props().label).toBe(3);

        const nextPage = wrapper.find('.pagingNext');
        expect(nextPage.length).toBe(1);

        const previousPage = wrapper.find('.pagingPrevious');
        expect(previousPage.length).toBe(1);
    });

    it('component with all fields disabled', () => {
        const data = {
            from: 1,
            to: 20,
            total: 60,
            per_page: 20,
            current_page: 1
        };

        const wrapper = setup({disabled: true, pagingData: data});
        wrapper.find('page').forEach(page => {
            expect(page.props().disabled).toEqual(true);
        })
    });

    it('component with non-empty paging data, pageChanged called', () => {
        const data = {
            from: 1,
            to: 20,
            total: 60,
            per_page: 20,
            current_page: 1
        };
        const testFunction = jest.fn();
        const wrapper = setup({pagingData: data, onPageChanged: testFunction, isShallow: false});
        wrapper.instance().pageChanged();
        expect(testFunction).toBeCalled();
    });

    it('component with non-empty paging data, next page clicked', () => {
        const data = {
            from: 1,
            to: 20,
            total: 60,
            per_page: 20,
            current_page: 1
        };
        const testFunction = jest.fn();
        const wrapper = setup({pagingData: data, onPageChanged: testFunction, isShallow: false});

        const nextPage = wrapper.find('FlatButton.pagingNext');
        expect(nextPage.length).toBe(1);
        nextPage.props().onClick();
        expect(testFunction).toBeCalled();
    });

    it('component with non-empty paging data, previous page clicked', () => {
        const data = {
            from: 21,
            to: 40,
            total: 60,
            per_page: 20,
            current_page: 2
        };
        const testFunction = jest.fn();
        const wrapper = setup({pagingData: data, onPageChanged: testFunction, isShallow: false});

        const page = wrapper.find('FlatButton.pagingPrevious');
        expect(page.length).toBe(1);
        page.props().onClick();
        expect(testFunction).toBeCalled();
    });

    it('component with non-empty paging data, page number is clicked', () => {
        const data = {
            from: 1,
            to: 20,
            total: 60,
            per_page: 20,
            current_page: 1
        };
        const testFunction = jest.fn();
        const wrapper = setup({pagingData: data, onPageChanged: testFunction, isShallow: false});
        const pages = wrapper.find('.publicationsListPaging .page');
        pages.at(1).props().onClick();
        expect(testFunction).toBeCalled();
    });

    it('component with non-empty paging data, state is updated', () => {
        const data = {
            from: 1,
            to: 20,
            total: 60,
            per_page: 20,
            current_page: 1
        };

        const nextData = {
            from: 21,
            to: 40,
            total: 60,
            per_page: 20,
            current_page: 2
        };
        const testFunction = jest.fn();
        const wrapper = setup({pagingData: data, onPageChanged: testFunction, isShallow: false});
        wrapper.instance().componentWillReceiveProps({pagingData: nextData});
        expect(JSON.stringify(wrapper.state())).toBe(JSON.stringify(nextData));

        wrapper.instance().componentWillReceiveProps({pagingData: {}, disabled: true});
        expect(JSON.stringify(wrapper.state())).toBe(JSON.stringify(nextData));
    });
});
