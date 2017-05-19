jest.dontMock('./FileUpload');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

import FileUpload from './FileUpload';

function setup() {
    const props = {
        title: 'No Records',
        explanationText: ' Lorem ipsum'
    };
    return shallow(<FileUpload {...props} />);
}

describe('File upload component snapshots tests', () => {
    it('renders default file upload component', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
