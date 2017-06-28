jest.dontMock('./AddJournalArticleForm');
// TODO: fix tests after go live
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import Immutable from 'immutable';

import AddJournalArticleForm from './AddJournalArticleForm';

let decreaseStep;
let submitRecordForApproval;
let cancelAddRecord;
let uploadFile;
let showSnackbar;

function setup(testData = {}) {
    decreaseStep = sinon.spy();
    submitRecordForApproval = sinon.spy();
    cancelAddRecord = sinon.spy();
    uploadFile = sinon.spy();
    showSnackbar = sinon.spy();

    const publicationSubTypeList = [

    ];

    // adding these props allows the snapshot to cover a larger amount fields
    const props = {
        acceptedFiles: Immutable.fromJS((typeof testData.acceptedFiles === 'undefined') ? [] : testData.acceptedFiles),
        cancelAddRecord,
        decreaseStep,
        form: 'testform',
        formValues: Immutable.fromJS({rek_subtype: 1}),
        handleSubmit: jest.fn(),
        publicationSubTypeList: Immutable.fromJS(publicationSubTypeList),
        selectedAuthors: (typeof testData.selectedAuthors === 'undefined') ? {} : Immutable.fromJS(testData.selectedAuthors),
        showSnackbar,
        submitRecordForApproval,
        uploadFile
    };

    return shallow(<AddJournalArticleForm {...props} />);
}


describe('Add Journal article form unit tests', () => {
    it('checks the form was submitted', () => {
        let app = setup();
        const testData = {};

        app.instance().submitRecord();
        expect(submitRecordForApproval.calledOnce).toEqual(true);
        expect(uploadFile.calledOnce).toEqual(false);
        expect(showSnackbar.calledOnce).toEqual(true);

        testData.acceptedFiles = [{
            name: 's12345678_test_file_archive.zip'
        }];

        app = setup(testData);
        app.instance().submitRecord();
        expect(submitRecordForApproval.calledOnce).toEqual(true);
        expect(uploadFile.calledOnce).toEqual(true);
        expect(showSnackbar.calledOnce).toEqual(false);
    });

    it('checked the file data was set', () => {
        const testData = {};
        let app = setup(testData);

        let result = app.instance().setFileData();
        expect(result).toEqual({});

        testData.acceptedFiles = [{
            name: 's12345678_test_file_archive.zip'
        }];
        app = setup(testData);
        result = app.instance().setFileData();
        const match = {
            fez_record_search_key_file_attachment_name: [
                {
                    rek_file_attachment_name: 's12345678_test_file_archive.zip',
                    rek_file_attachment_name_order: 1
                }
            ]
        };

        expect(result).toEqual(match);
    });

    it('checked the author data was set', () => {

    });

    it('checks the add records was cancelled', () => {
        const app = setup();

        app.instance().cancelAddingRecord();

        expect(decreaseStep.calledOnce).toEqual(true);
        expect(cancelAddRecord.calledOnce).toEqual(true);
    });
});
