jest.dontMock('./PublicationSubtypeForm');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import { loadPublicationSubtypesList } from 'actions';
import { PublicationSubtypeForm } from './PublicationSubtypeForm';

function setup(props) {
    return shallow(<PublicationSubtypeForm {...props} />);
}

describe('PublicationSubtypeForm snapshots tests', () => {
    it('renders correctly', () => {
        const props = {
            vocabId: 453581,
            subtypesList: []
        };

        const wrapper = setup(props);

        const tree = toJson(wrapper);

        expect(tree).toMatchSnapshot();
    });
});
