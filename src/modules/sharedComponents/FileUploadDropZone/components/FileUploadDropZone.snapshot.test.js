jest.dontMock('./FileUploadDropZone');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Immutable from 'immutable';

import {locale} from 'config';
import FileUploadDropZone from './FileUploadDropZone';

function setup() {
    const data = {};
    const metadata = locale.sharedComponents.files.fields.metadata;

    data[metadata.description] = 'test file description';
    data[metadata.accessCondition] = 1;
    data[metadata.embargoDate] = 'Thu May 25 2017 00:00:00 GMT+1000 (AEST)';

    const fileData = {
        file: {
            name: 's12345678_test_file_archive.zip',
            size: 5307669356,
            type: 'application/zip'
        }
    };

    const fileMetadata = Immutable.fromJS(Object.assign({}, fileData, data));

    const props = {
        form: 'testForm',
        openDialog: jest.fn(),
        showSnackbar: jest.fn(),
        fileMetadata,
        uploadError: ''
    };
    return shallow(<FileUploadDropZone {...props} />);
}

describe('File upload dropzone snapshots tests', () => {
    it('renders default file upload dropzone component', () => {
        const app = setup();
        expect(toJson(app)).toMatchSnapshot();
    });
});
