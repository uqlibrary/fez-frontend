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

function setup(testData = {}) {
    decreaseStep = sinon.spy();
    submitRecordForApproval = sinon.spy();
    cancelAddRecord = sinon.spy();

    const publicationSubTypeList = [

    ];

    // adding these props allows the snapshot to cover a larger amount fields
    const props = {
        cancelAddRecord,
        decreaseStep,
        fileMetadata: (typeof testData.fileMetadata === 'undefined') ? {} : Immutable.fromJS(testData.fileMetadata),
        form: 'testform',
        formValues: Immutable.fromJS({rek_subtype: 1}),
        handleSubmit: jest.fn(),
        publicationSubTypeList: Immutable.fromJS(publicationSubTypeList),
        selectedAuthors: (typeof testData.selectedAuthors === 'undefined') ? {} : Immutable.fromJS(testData.selectedAuthors),
        submitRecordForApproval
    };

    return shallow(<AddJournalArticleForm {...props} />);
}


describe('Add Journal article form unit tests', () => {
    it('checks the form was submitted', () => {
        const app = setup();

        app.instance().submitRecord();
        expect(decreaseStep.calledOnce).toEqual(true);
        expect(submitRecordForApproval.calledOnce).toEqual(true);
    });

    it('checked the file data was set', () => {

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
