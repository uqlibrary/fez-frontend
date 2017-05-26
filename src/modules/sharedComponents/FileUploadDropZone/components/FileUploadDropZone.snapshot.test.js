jest.dontMock('./FileUploadDropZone');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

import FileUploadDropZone from './FileUploadDropZone';

function setup() {
    const props = {
        form: 'testForm',
        openDialog: jest.fn(),
        showSnackbar: jest.fn()
    };
    return shallow(<FileUploadDropZone {...props} />);
}

describe('File upload dropzone snapshots tests', () => {
    it('renders default file upload dropzone component', () => {
        const app = setup();
        expect(toJson(app)).toMatchSnapshot();
    });
});
