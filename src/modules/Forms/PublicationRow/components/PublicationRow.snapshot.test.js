jest.dontMock('./PublicationRow');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

import PublicationRow from './PublicationRow';

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
    return shallow(<PublicationRow {...props} />);
}

describe('Publication row results snapshots tests', () => {
    it('renders default publication row', () => {
        const wrapper = setup();
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});
