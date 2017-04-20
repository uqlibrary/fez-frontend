jest.dontMock('./PublicationSearchForm');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';


import PublicationSearchForm from './PublicationSearchForm';

// otherwise it throws an 'Unknown prop `onTouchTap` on <div> tag.' error during the test
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


function shallowSetup() {
    const props = {
        helpTitle: 'Help Title',
        helpText: 'Lorem Ipsum',
        title: 'Component Title',
        explanationText: 'Component Search Text'
    };

    return shallow(<PublicationSearchForm {...props} />);
}


describe('Publication search form snapshots tests', () => {
    it('renders default publication search form page', () => {
        const app = shallowSetup();
        const tree = toJson(app);
        expect(tree).toMatchSnapshot();
    });
});
