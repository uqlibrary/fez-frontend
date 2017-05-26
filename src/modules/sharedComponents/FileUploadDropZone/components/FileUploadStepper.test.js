jest.dontMock('./FileUploadStepper');

import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';

import {documentAccessTypes} from 'mock/data/documentAccessTypes';
import FileUploadStepper from './FileUploadStepper';

let loadDocumentAccessTypes;

function setup(documentAccessTypes) {
    loadDocumentAccessTypes = sinon.spy();
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
        loadDocumentAccessTypes
    };
    return shallow(<FileUploadStepper {...props} />);
}

describe('File upload stepper snapshots tests', () => {
    it('loads the document access types', () => {
        const app = setup(documentAccessTypes);
        app.instance().componentDidMount();
        expect(loadDocumentAccessTypes.calledOnce).toEqual(true);

    });
});