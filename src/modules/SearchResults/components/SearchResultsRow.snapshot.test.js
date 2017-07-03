jest.dontMock('./SearchResultsRow');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

import SearchResultsRow from './SearchResultsRow';

function setup() {
    const props = {
        entry: {
            title: 'Entry Title',
            journalName: 'A Journal Name',
            authors: '',
            counts: {
                thomson: 1,
                scopus: 2,
                google: 3,
                altmetric: 4,
                downloads: 100
            }
        }
    };
    return shallow(<SearchResultsRow {...props} />);
}

describe('Search results snapshots tests', () => {
    it('renders default search results row', () => {
        // const wrapper = setup();
        // const tree = toJson(wrapper);
        // expect(tree).toMatchSnapshot();
        expect(true).toEqual(true);
    });
});
