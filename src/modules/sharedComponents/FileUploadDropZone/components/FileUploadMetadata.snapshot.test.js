jest.dontMock('./FileUploadMetadata');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Immutable from 'immutable';

import {documentAccessTypes} from 'mock/data/documentAccessTypes';
import FileUploadMetadata from './FileUploadMetadata';

function setup(ds) {
    const file = {
        name: 's12345678_test_file_archive.zip',
        size: 'application/pdf',
        type: 5307669356
    };

    const props = {
        dataSource: ds,
        stepperIndex: 0,
        file,
        form: 'testForm',
        formValues: Immutable.fromJS({'filesAccessConditions-0': 3})
    };
    return shallow(<FileUploadMetadata {...props} />);
}

describe('File upload metadata snapshots tests', () => {
    it('renders default file upload metadata component', () => {
        const app = setup(documentAccessTypes);
        expect(toJson(app)).toMatchSnapshot();
    });
});
