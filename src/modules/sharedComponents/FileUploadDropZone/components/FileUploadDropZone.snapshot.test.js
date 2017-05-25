jest.dontMock('./FileUploadDropZone');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

import FileUploadDropZone from './FileUploadDropZone';

function setup() {
    const acceptedFiles = [
        {
            name: 's12345678_test_file_archive.zip',
            size: 5307669356,
            type: 'application/zip'
        },
        {
            name: 's12345678_test_file_boot.iso',
            size: 241172480,
        }
    ];

    const props = {
        acceptedFiles: acceptedFiles,
        form: 'testForm',
        isDialogOpen: true,
        isUploadCompleted: false,
        cancelUpload: jest.fn(),
        closeDialog: jest.fn(),
        decreaseStep: jest.fn(),
        increaseStep: jest.fn(),
        openDialog: jest.fn(),
        resetSteps: jest.fn(),
        showSnackbar: jest.fn(),
        uploadFile: jest.fn(),
        stepperIndex: 0,
        uploadProgress: {}
    };
    return shallow(<FileUploadDropZone {...props} />);
}

describe('File upload dropzone snapshots tests', () => {
    it('renders default file upload dropzone component', () => {
        const app = setup();
        expect(toJson(app)).toMatchSnapshot();
    });
});
