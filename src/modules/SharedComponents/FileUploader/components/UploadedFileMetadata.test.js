jest.dontMock('./UploadedFileMetadata');

import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import Immutable from 'immutable';

import UploadedFileMetadata from './UploadedFileMetadata';
import {locale} from 'config';
import {documentAccessTypes} from 'mock/data/documentAccessTypes';

let deleteFile;

function setup(accessCondition, documentAccessTypes) {
    const data = {};
    const metadata = locale.sharedComponents.files.fields.metadata;
    deleteFile = sinon.spy();

    data[metadata.description] = 'test file description';
    data[metadata.accessCondition] = accessCondition;
    data[metadata.embargoDate] = 'Thu May 25 2017 00:00:00 GMT+1000 (AEST)';

    const fileData = {
        file: {
            name: 's12345678_test_file_archive.zip',
            size: 5307669356,
            type: 'application/zip'
        }
    };

    const dataSource = Object.assign({}, fileData, data);

    const props = {
        form: 'testForm',
        dataSource,
        deleteFile,
        documentAccessTypes: Immutable.fromJS(documentAccessTypes)
    };
    return shallow(<UploadedFileMetadata {...props} />);
}
describe('File upload uploaded file metadata unit tests', () => {
    it('deletes a file', () => {
        const app = setup(null, documentAccessTypes);

        app.instance().deleteFile();
        expect(deleteFile.calledOnce).toEqual(true);
    });
});
