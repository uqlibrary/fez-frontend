jest.dontMock('./FileUploadStepper');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

import {documentAccessTypes} from 'mock/data/documentAccessTypes';
import FileUploadStepper from './FileUploadStepper';

function setup(documentAccessTypes) {
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
        acceptedFiles,
        form: 'testForm',
        stepperIndex: 0,
        documentAccessTypes,
        loadDocumentAccessTypes: jest.fn()
    };
    return shallow(<FileUploadStepper {...props} />);
}

describe('File upload stepper snapshots tests', () => {
    it('renders default file upload stepper component', () => {
        const app = setup(documentAccessTypes);
        expect(toJson(app)).toMatchSnapshot();

    });
});
