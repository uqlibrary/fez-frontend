jest.dontMock('./Confirmation');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

import Confirmation from './Confirmation';
import Immutable from 'immutable';

function setup() {
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
        acceptedFiles: files
    };
    return shallow(<Confirmation {...props} />);
}
describe('File upload confirmation snapshots tests', () => {
    it('renders default file upload confirmation component', () => {
        const app = setup();

        const nextProps = {uploadProgress: Immutable.fromJS({
            name: 's12345678_test_file_boot.iso',
            progress: '5%'
        })};
        app.instance().componentWillUpdate(nextProps);

        expect(toJson(app)).toMatchSnapshot();
    });
});
