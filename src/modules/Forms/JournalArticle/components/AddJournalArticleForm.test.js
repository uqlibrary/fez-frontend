jest.dontMock('./AddJournalArticleForm');

import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import Immutable from 'immutable';

import AddJournalArticleForm from './AddJournalArticleForm';

let decreaseStep;
let submitRecordForApproval;
let cancelAddRecord;
let uploadFile;

function setup(testData = {}) {
    decreaseStep = sinon.spy();
    submitRecordForApproval = sinon.spy();
    cancelAddRecord = sinon.spy();
    uploadFile = sinon.spy();

    const publicationSubTypeList = [
        {'id': 1, 'label': 'Article (original research)'},
        {'id': 2, 'label': 'Critical review of research, literature review, critical commentary'},
        {'id': 3, 'label': 'Letter to editor, brief commentary or brief communication'},
        {'id': 4, 'label': 'Correction/erratum'},
        {'id': 5, 'label': 'Review of book, film, TV, video, software, performance, music etc ...'},
        {'id': 6, 'label': 'Editorial'},
        {'id': 7, 'label': 'Discussion - respones, round table/panel discussions. Q&A, reply'},
        {'id': 8, 'label': 'Creative work'},
        {'id': 9, 'label': 'Others'}
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
        submitRecordForApproval,
        uploadFile
    };

    return shallow(<AddJournalArticleForm {...props} />);
}


describe('Add Journal article form unit tests', () => {
    it('checks the form was submitted', () => {
        const app = setup();

        app.instance().submitRecord();
        expect(submitRecordForApproval.calledOnce).toEqual(true);
        expect(uploadFile.calledOnce).toEqual(true);
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
        const testData = {};
        let app = setup(testData);

        let result = app.instance().setAuthorData();
        expect(result).toEqual({});

        testData.selectedAuthors = [{
            aut_display_name: 'author 1'
        },
        {
            aut_display_name: 'author 2'
        }];
        app = setup(testData);
        result = app.instance().setAuthorData();
        const match = {
            fez_record_search_key_author: [
                {
                    rek_author: 'author 1',
                    rek_author_order: 1
                },
                {
                    rek_author: 'author 2',
                    rek_author_order: 2
                }
            ]
        };
        expect(result).toEqual(match);
    });

    it('checks the add records was cancelled', () => {
        const app = setup();

        app.instance().cancelAddingRecord();

        expect(decreaseStep.calledOnce).toEqual(true);
        expect(cancelAddRecord.calledOnce).toEqual(true);
    });
});
