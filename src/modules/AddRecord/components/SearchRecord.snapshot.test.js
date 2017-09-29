import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import Immutable from 'immutable';

import SearchRecord from './SearchRecord';

function setup(values) {
    return shallow(<SearchRecord {...values}/>);
}

describe('Search record', () => {
    it('should render stepper and a publication search form', () => {
        const wrapper = setup({history: {}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should perform search and redirect to results page', () => {
        const searchPublications = jest.fn();
        const history = {
            push: (path) => (expect(path).toBe('/records/add/results'))
        };

        const wrapper = setup({history: history, actions: {searchPublications: searchPublications}});
        wrapper.instance()._performSearch(Immutable.Map({searchQuery: 'bla'}));

        expect(searchPublications).toBeCalled();
    });
});
