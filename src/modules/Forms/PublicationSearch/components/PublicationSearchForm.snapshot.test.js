jest.dontMock('./PublicationSearchForm');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import PublicationSearchForm from './PublicationSearchForm';

function setup() {
    const props = {
        title: 'Do Something',
        explanationText: 'This is some text that explains what this form block displays',
        defaultSearchFieldLabel: 'Search field label',
        defaultButtonLabel: 'Button Label',
        helpText: 'Some help text content',
        helpTitle: 'Help Title'
    };
    return shallow(<PublicationSearchForm {...props} />);
}

describe('PublicationSearchForm page snapshots tests', () => {
    it('renders default about page', () => {
        const wrapper = setup();
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});
