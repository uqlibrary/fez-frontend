jest.dontMock('./FileUploadStepper');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

import {documentAccessTypes} from 'mock/data/documentAccessTypes';
import FileStepper from './FileStepper';

const CONFIRMATION_INDEX = 2;
const UPLOAD_INDEX = 3;

function setup(documentAccessTypes, stepperIndex = 0, fileList) {
    const acceptedFiles = fileList || [
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
        stepperIndex,
        documentAccessTypes,
        loadDocumentAccessTypes: jest.fn()
    };
    return shallow(<FileStepper {...props} />);
}

describe('File upload stepper unit tests', () => {
    it('renders default file upload stepper component', () => {
        const app = setup(documentAccessTypes);
        expect(toJson(app)).toMatchSnapshot();
    });

    it('renders the confirmation components', () => {
        const app = setup(documentAccessTypes, CONFIRMATION_INDEX);
        expect(toJson(app)).toMatchSnapshot();
    });

    it('renders the upload components', () => {
        const app = setup(documentAccessTypes, UPLOAD_INDEX);
        expect(toJson(app)).toMatchSnapshot();
    });
});
