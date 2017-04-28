jest.dontMock('./AddJournalArticleForm');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Immutable from 'immutable';
import {createStore} from 'redux';

import AddJournalArticleForm from './AddJournalArticleForm';

function setup() {
    const store = createStore(jest.fn());
    const publicationSubTypes = [
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
        types: Immutable.fromJS(publicationSubTypes),
        loadPublicationSubTypes: jest.fn(),
        loadAuthorData: jest.fn(),
        store: store
    };

    return shallow(<AddJournalArticleForm {...props} />);
}


describe('Document type form integration tests', () => {
    it('renders default document type component', () => {
        const app = setup();
        expect(toJson(app)).toMatchSnapshot();
    });
});