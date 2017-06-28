jest.dontMock('./FileMetadata');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Immutable from 'immutable';

import FileMetadata from './FileMetadata';

function setup() {
    const acceptedFiles = Immutable.fromJS([{
        name: 's12345678_test_file_archive.zip',
        size: 'application/pdf',
        type: 5307669356
    }]);

    const props = {
        acceptedFiles,
        deleteFile: jest.fn(),
        form: 'testForm'
    };
    return shallow(<FileMetadata {...props} />);
}

describe('File metadata snapshots tests', () => {
    it('renders default file metadata component', () => {
        const app = setup();
        expect(toJson(app)).toMatchSnapshot();
    });
});
