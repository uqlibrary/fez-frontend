jest.dontMock('./FileMetadata');

import React from 'react';
import {shallow} from 'enzyme';
import Immutable from 'immutable';
import sinon from 'sinon';

import FileMetadata from './FileMetadata';
import {locale} from 'config';

let deleteFile;
let deleteAllFiles;
let handleClose;
let app;

// TODO: Need to fix this test and rename back to FileMetadata.test.js

describe('File metadata unit tests', () => {
    beforeEach(() => {
        const acceptedFiles = Immutable.fromJS([{
            name: 's12345678_test_file_archive.zip',
            size: 'application/pdf',
            type: 5307669356
        }]);

        deleteFile = sinon.spy();
        deleteAllFiles = sinon.spy();
        handleClose = sinon.spy();

        const props = {
            acceptedFiles,
            deleteFile,
            deleteAllFiles,
            handleClose,
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

    it('updates the state on handleclose', () => {
        app.instance().handleClose();
        expect(app.state('deleteAction')).toEqual('');
        expect(app.state('deleteFileIndex')).toEqual(-1);
        expect(app.state('deleteDialogOpen')).toEqual(false);
        expect(app.state('deleteDialogContent')).toEqual('');
    });

    it('deletes a file', () => {
        app.setState({'deleteSingleFile': true});
        app.instance().deleteFileAction();
        expect(deleteFile.calledOnce).toEqual(true);
    });

    it('deletes multiple files', () => {
        app.setState({'deleteSingleFile': false});
        app.instance().deleteFileAction();
        expect(deleteAllFiles.calledOnce).toEqual(true);
    });

    it('it updates the state for a delete file confirmation', () => {
        const index = 1;
        const fileInformation = locale.sharedComponents.files;
        const messages = fileInformation.messages;

        app.instance().deleteFileConfirmation(index);

        expect(app.state('deleteSingleFile')).toEqual(true);
        expect(app.state('deleteFileIndex')).toEqual(index);
        expect(app.state('deleteDialogOpen')).toEqual(true);
        expect(app.state('deleteDialogContent')).toEqual(messages.deleteFileDialogContent);
    });

    it('it updates the state for deleting all files confirmation', () => {
        const fileInformation = locale.sharedComponents.files;
        const messages = fileInformation.messages;

        app.instance().deleteAllFilesConfirmation();

        expect(app.state('deleteSingleFile')).toEqual(false);
        expect(app.state('deleteFileIndex')).toEqual(-1);
        expect(app.state('deleteDialogOpen')).toEqual(true);
        expect(app.state('deleteDialogContent')).toEqual(messages.deleteAllFilesDialogContent);
    });

    it('it updates the state for accessfields and open access', () => {
        const fileInformation = locale.sharedComponents.files;
        const constants = fileInformation.constants;
        const data = [];
        const field = 'testfield';

        app.instance().updateLocalState(field)(null, constants.closedAccessId);

        data[field] = constants.closedAccessId;

        expect(app.state('accessFields')).toEqual(data);
        expect(app.state('isOpenAccess')).toEqual(false);

        app.instance().updateLocalState(field)(null, constants.openAccessId);

        data[field] = constants.openAccessId;

        expect(app.state('accessFields')).toEqual(data);
        expect(app.state('isOpenAccess')).toEqual(true);
    });
});
