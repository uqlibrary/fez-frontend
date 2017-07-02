jest.dontMock('./PublicationSearchForm');

import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import Immutable from 'immutable';
import PublicationSearchForm from './PublicationSearchForm';
import {locale} from 'config';

const buttonLabels = locale.pages.addRecord.searchForPublication.buttonLabelVariants;
let handleSubmit;
let app;
let loadDoiResultsList;
let loadPubmedResultsList;
let loadTitleResultsList;

function searchSetup(testValue) {
    loadDoiResultsList = sinon.spy();
    loadPubmedResultsList = sinon.spy();
    loadTitleResultsList = sinon.spy();
    const props = {
        help: {
            title: 'Help Title',
            text: 'Lorem Ipsum',
        },
        title: 'Component Title',
        explanationText: 'Component Search Text',
        handleSubmit: handleSubmit,
        formValues: Immutable.fromJS({doiSearch: testValue}),
        loadDoiResultsList,
        loadPubmedResultsList,
        loadTitleResultsList
    };

    app = shallow(<PublicationSearchForm {...props} />);
}

describe('Publication search form integration tests', () => {
    it('performs a DOI search', () => {
        searchSetup('10.1163/9789004326828');
        app.instance().performSearch();
        expect(loadDoiResultsList.calledOnce).toEqual(true);
    });

    it('performs a pubmed search', () => {
        searchSetup('123456');
        app.instance().performSearch();
        expect(loadPubmedResultsList.calledOnce).toEqual(true);
    });

    it('performs a title search', () => {
        searchSetup('Title Search min 10 characters');
        app.instance().performSearch();
        expect(loadTitleResultsList.calledOnce).toEqual(true);
    });
});
