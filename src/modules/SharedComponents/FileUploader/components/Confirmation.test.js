jest.dontMock('./Confirmation');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

import Confirmation from './Confirmation';
import Immutable from 'immutable';
import sinon from 'sinon';

let updateFileMetadata;

function setup(testData = {}) {
    updateFileMetadata = sinon.spy();
    const files = [
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
        form: 'testForm',
        acceptedFiles: files,
        ...testData
    };
    return shallow(<Confirmation {...props} />);
}
describe('File upload confirmation unit tests', () => {
    it('fails to set the metadata of the uploaded files in the states', () => {
        const app = setup();

        app.instance().setUploadedDataState();
        expect(updateFileMetadata.callcedOnce).toBeUndefined();
    });
});
