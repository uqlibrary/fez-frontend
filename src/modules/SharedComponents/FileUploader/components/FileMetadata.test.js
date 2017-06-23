jest.dontMock('./FileMetadata');

import React from 'react';
import {shallow} from 'enzyme';
import Immutable from 'immutable';
import sinon from 'sinon';

import FileMetadata from './FileMetadata';
import {locale} from 'config';

let deleteFile;
let app;

describe('File metadata unit tests', () => {
    beforeEach(() => {
        const acceptedFiles = Immutable.fromJS([{
            name: 's12345678_test_file_archive.zip',
            size: 'application/pdf',
            type: 5307669356
        }]);

        deleteFile = sinon.spy();

        const props = {
            acceptedFiles,
            deleteFile,
            form: 'testForm'
        };
        app = shallow(<FileMetadata {...props} />);
    });

    it('checks if the access type state', () => {
        const accessIds = locale.sharedComponents.files.constants;
        app.state('accessFields').testField1 = accessIds.openAccessId;
        expect(app.instance().isOpenAccessSelected()).toEqual(true);

        app.state('accessFields').testField1 = accessIds.closedAccessId;
        expect(app.instance().isOpenAccessSelected()).toEqual(false);
    });
});
