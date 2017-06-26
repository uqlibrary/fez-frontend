jest.dontMock('./AddJournalArticleForm');

import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import Immutable from 'immutable';
import {createStore} from 'redux';

import AddJournalArticleForm from './AddJournalArticleForm';

function setup() {
    const store = createStore(jest.fn());
    const publicationSubTypeList = [
        {
            "cvr_id": 4699,
            "cvr_parent_cvo_id": 453573,
            "cvr_child_cvo_id": 453574,
            "controlled_vocab": {
                "cvo_id": 453574,
                "cvo_title": "Article (original research)",
                "cvo_desc": "",
                "cvo_image_filename": null,
                "cvo_external_id": null,
                "cvo_hide": 0,
                "cvo_order": 2,
                "cvo_lat": null,
                "cvo_long": null,
                "cvo_policy": null,
                "controlled_vocab_children": []
            }
        }, {
            "cvr_id": 4700,
            "cvr_parent_cvo_id": 453573,
            "cvr_child_cvo_id": 453575,
            "controlled_vocab": {
                "cvo_id": 453575,
                "cvo_title": "Critical review of research, literature review, critical commentary",
                "cvo_desc": "",
                "cvo_image_filename": null,
                "cvo_external_id": null,
                "cvo_hide": 0,
                "cvo_order": 4,
                "cvo_lat": null,
                "cvo_long": null,
                "cvo_policy": null,
                "controlled_vocab_children": []
            }
        }];

    // adding these props allows the snapshot to cover a larger amount fields
    const props = {
        publicationSubTypeList: Immutable.fromJS(publicationSubTypeList),
        loadPublicationSubTypeList: jest.fn(),
        loadAuthorData: jest.fn(),
        form: 'testForm',
        formValues: Immutable.fromJS({publicationType: 179}),
        handleSubmit: jest.fn(),
        store: store
    };

    return shallow(<AddJournalArticleForm {...props} />);
}


describe('Add Journal article form snapshot tests', () => {
    it('renders default add journal article form', () => {
        const app = setup();
        expect(toJson(app)).toMatchSnapshot();
    });
});
