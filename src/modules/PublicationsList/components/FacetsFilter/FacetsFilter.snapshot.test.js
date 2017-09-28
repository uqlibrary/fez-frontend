jest.dontMock('./FacetsFilter');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import {possibleUnclaimedList} from 'mock/data';

import FacetsFilter from './FacetsFilter';

function setup({facetsData = {}, onFacetsChanged = jest.fn(), activeFacets = {}, excludeFacetsList = [], disabled = false}) {
    const props = {
        facetsData,
        onFacetsChanged,
        activeFacets,
        excludeFacetsList,
        disabled
    }

    return shallow(<FacetsFilter {...props} />);
}

describe('FacetsFilter renders ', () => {
    it('empty component for empty data', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('components for mock data', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const wrapper = setup({facetsData});
        expect(toJson(wrapper)).toMatchSnapshot();

        const categories = wrapper.find('.facetsCategory');
        expect(categories.length).toEqual(6);
    });

    it('components for mock data with excluded facets', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const wrapper = setup({facetsData, excludeFacetsList: ['Display type']});
        expect(toJson(wrapper)).toMatchSnapshot();
        const categories = wrapper.find('.facetsCategory');
        expect(categories.length).toEqual(5);
    });

    it('components for mock data with disabled flag set', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const wrapper = setup({facetsData, disabled: true});
        expect(toJson(wrapper)).toMatchSnapshot();

        const categories = wrapper.find('.facetsCategory');
        wrapper.find('.facetsCategory').forEach(item => {
            expect(item.props().disabled).toEqual(true);
        })
    });

    it('components for mock data with active facets set', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const wrapper = setup({facetsData, activeFacets: {'Display type': 179}});
        expect(toJson(wrapper)).toMatchSnapshot();
        const category = wrapper.find('.facetsCategory.active');
        expect(category.length).toEqual(1);
    });


    it('components for mock data deactivating a facet selection', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const wrapper = setup({facetsData, activeFacets: {'Display type': 179}});

        wrapper.instance().handleFacetClick('Display type', 130);
        expect(JSON.stringify(wrapper.state().activeFacets)).toEqual(JSON.stringify({'Display type': 130}));

        wrapper.instance().handleFacetClick('Display type', 130);
        expect(JSON.stringify(wrapper.state().activeFacets)).toEqual(JSON.stringify({}));
    });

    it('components for mock data activating a facet selection', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const wrapper = setup({facetsData, activeFacets: {'Display type': 179}});

        wrapper.instance().handleFacetClick('Keywords', 'Biochemistry');
        expect(JSON.stringify(wrapper.state().activeFacets)).toEqual(JSON.stringify({'Display type': 179, 'Keywords': 'Biochemistry'}));
    });

    it('components for mock data resetting a facet selection', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const wrapper = setup({facetsData, activeFacets: {'Display type': 179}});

        wrapper.instance().handleResetClick();
        expect(JSON.stringify(wrapper.state().activeFacets)).toEqual(JSON.stringify({}));
    });
});
