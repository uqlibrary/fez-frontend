jest.dontMock('./FileUploader');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Immutable from 'immutable';

import {locale} from 'config';
import FileUploader from './FileUploader';

function setup() {
    const acceptedFiles = Immutable.fromJS([{
            name: 's12345678_test_file_archive.zip',
            size: 5307669356,
            type: 'application/zip'
    }]);

    const props = {
        acceptedFiles,
        form: 'testForm',
        isUploadCompleted: true,
        initializeMetadata: jest.fn(),
        setAcceptedFileList: jest.fn(),
        showSnackbar: jest.fn()
    };
    return shallow(<FileUploader {...props} />);
}

describe('File upload dropzone snapshots tests', () => {
    it('renders default file upload dropzone component', () => {
        const app = setup();
        expect(toJson(app)).toMatchSnapshot();
    });
});
