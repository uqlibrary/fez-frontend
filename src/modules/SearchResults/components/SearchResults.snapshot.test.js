jest.dontMock('./SearchResults');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Immutable from 'immutable';

import SearchResults from './SearchResults';
import {externalDoiSearchResultList} from '../../../mock/data/publicationSearch';

function setup(ds) {
    const props = {
        title: 'Component Title',
        explanationText: 'Lorem Ipsum',
        dataSource: Immutable.fromJS(ds)
    };
    return shallow(<SearchResults {...props} />);
}

describe('Search results snapshots tests', () => {
    it('renders default search results page', () => {
        const wrapper = setup(externalDoiSearchResultList);
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});
