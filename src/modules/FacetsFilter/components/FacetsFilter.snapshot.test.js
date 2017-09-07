jest.dontMock('./FacetsFilter');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import {possibleUnclaimedAfterFacetsFilterTransform, possibleUnclaimed, facetsDataMocked} from '../../../mock/data/publications/';

import FacetsFilter from './FacetsFilter';

function setup(values) {
    return shallow(<FacetsFilter {...values} />);
}

describe('Claim Publication FacetsFilter tests : ', () => {
    it('Render the facet list from mock data', () => {
        const facetsData = possibleUnclaimed.filters.facets;
        const omitCategory = [];
        const activeFacets = {};
        const values = {facetsData, omitCategory, activeFacets};
        const wrapper = setup(values);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Render the facet list from mock data, omitting the Display type category', () => {
        const facetsData = possibleUnclaimed.filters.facets;
        const omitCategory = ['Display type'];
        const activeFacets = {};
        const values = {facetsData, omitCategory, activeFacets};
        const wrapper = setup(values);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Render the facet list from mock data, with the Journal Article facet active in the Display type category', () => {
        const facetsData = possibleUnclaimed.filters.facets;
        const omitCategory = [];
        const activeFacets = {'Display type': 'Journal Article'};
        const values = {facetsData, omitCategory, activeFacets};
        const wrapper = setup(values);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Render an empty component', () => {
        const facetsData = {};
        const omitCategory = [];
        const activeFacets = {'Display type': 'Journal Article'};
        const values = {facetsData, omitCategory, activeFacets};
        const wrapper = setup(values);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Test handleResetClick method calls facetsFunction prop when we reset the activeFacets', () => {
        const testMethod = jest.fn();
        const wrapper = setup({facetsFunction: testMethod});
        wrapper.instance().handleResetClick();
        expect(testMethod).toHaveBeenCalled();
    });

    it('Test handleFacetClick method calls the facetsFunction prop when we click on a facet', () => {
        const testMethod = jest.fn();
        const wrapper = setup({facetsFunction: testMethod});
        wrapper.instance().handleFacetClick();
        expect(testMethod).toHaveBeenCalled();
    });
});


// function setup2({values}) {
//     return shallow(<FacetsFilter facetsData={values} />);
// }
// describe('Claim Publication FacetsFilter function tests : ', () => {
//     // TODO: Test the transformRawData function
//     it('Test the data we get out of the transformRawData function is as expected (possibleUnclaimed -> possibleUnclaimedAfterFacetsFilterTransform', () => {
//         const wrapper = setup2(facetsDataMocked);
//         wrapper.instance().transformRawData();
//         // expect(wrapper.instance(aggregations)).toEqual(possibleUnclaimedAfterFacetsFilterTransform);
//     });
//
//     // TODO: Test the getNestedListItems function
// });
