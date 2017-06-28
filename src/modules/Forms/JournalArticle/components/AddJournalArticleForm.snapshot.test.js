jest.dontMock('./AddJournalArticleForm');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Immutable from 'immutable';
import {createStore} from 'redux';

import AddJournalArticleForm from './AddJournalArticleForm';

function setup(acceptedFiles) {
    const store = createStore(jest.fn());
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
        acceptedFiles,
        form: 'testForm',
        formValues: Immutable.fromJS({publicationType: 179}),
        handleSubmit: jest.fn(),
        loadAuthorData: jest.fn(),
        loadPublicationSubTypeList: jest.fn(),
        publicationSubTypeList: Immutable.fromJS(publicationSubTypeList),
        store: store
    };

    return shallow(<AddJournalArticleForm {...props} />);
}


describe('Add Journal article form snapshot tests', () => {
    it('renders default add journal article form', () => {
        let app = setup(Immutable.fromJS([]));
        expect(toJson(app)).toMatchSnapshot();

        const acceptedFiles = Immutable.fromJS([{
            name: 's12345678_test_file_archive.zip',
            size: 5307669356,
            type: 'application/zip'
        }]);
        app = setup(acceptedFiles);
        expect(toJson(app)).toMatchSnapshot();
    });
});
