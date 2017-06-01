jest.dontMock('./FileUploadInfoRow');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

import FileUploadInfoRow from './FileUploadInfoRow';

function setup(f, showProgress = false, uploadProgress = '') {
    const file = {
        name: `s12345678_test_file_archive.${f.ext}`,
        size: f.size,
        type: f.type
    };

    const props = {
        form: 'testForm',
        file,
        showProgress,
        uploadProgress
    };
    return shallow(<FileUploadInfoRow {...props} />);
}

describe('File upload info row snapshots tests', () => {
    it('renders default file upload info row component', () => {
        // test a zip
        let file = {
            type: 'application/pdf',
            size: 5307669356,
            ext: 'zip'
        };

        let app = setup(file);
        expect(toJson(app)).toMatchSnapshot();

        // test an image
        file = {
            type: 'image/jpeg',
            size: 0,
            ext: 'jpg'
        };

        app = setup(file);
        expect(toJson(app)).toMatchSnapshot();

        // test a generic
        file = {
            type: '',
            ext: 'iso'
        };

        app = setup(file, true, '5%');
        expect(toJson(app)).toMatchSnapshot();
    });
});
