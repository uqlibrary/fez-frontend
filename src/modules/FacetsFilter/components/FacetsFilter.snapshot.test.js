jest.dontMock('./FacetsFilter');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import {possibleUnclaimed} from '../../../mock/data/publications/';

import FacetsFilter from './FacetsFilter';

function setup(values) {
    const props = values;
    return shallow(<FacetsFilter {...props} />);
}

describe('Claim Publication FacetsFilter test : ', () => {
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
        const activeFacets = {'Display type':'Journal Article'};
        const values = {facetsData, omitCategory, activeFacets};
        const wrapper = setup(values);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Render an empty component', () => {
        const facetsData = {};
        const omitCategory = [];
        const activeFacets = {'Display type':'Journal Article'};
        const values = {facetsData, omitCategory, activeFacets};
        const wrapper = setup(values);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
