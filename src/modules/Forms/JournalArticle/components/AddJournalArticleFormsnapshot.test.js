jest.dontMock('./AddJournalArticleForm');

import React from 'react';
import {mount} from 'enzyme';
import toJson from 'enzyme-to-json';

import {reduxForm} from 'redux-form';
import {reducer as formReducer} from 'redux-form';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import Immutable from 'immutable';
import {authorsReducer} from 'uqlibrary-react-toolbox';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

import AddJournalArticleForm from './AddJournalArticleForm';

// otherwise it throws an 'Unknown prop `onTouchTap` on <div> tag.' error during the test
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

let app;

describe('Add journal form integration tests', () => {
    beforeEach(() => {
        const store = createStore(combineReducers({form: formReducer, authors: authorsReducer}));

        const muiTheme = getMuiTheme();
        const Decorated = reduxForm({ form: 'testForm' })(AddJournalArticleForm);

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

        const authors = [
            {'id': 202, 'name': 'Author 8'},
            {'id': 263, 'name': 'Author 9'},
            {'id': 174, 'name': 'Author 10'},
            {'id': 177, 'name': 'Author 11'}
        ];


        const props = {
            types: Immutable.fromJS(publicationSubTypes),
            listOfAuthors: Immutable.fromJS(authors),
            loadPublicationSubTypes: jest.fn(),
            loadAuthorData: jest.fn()
        };

        app = mount(
            <Provider store={store}>
                <Decorated {...props} />
            </Provider>,
            { context: {muiTheme},
                childContextTypes: {muiTheme: React.PropTypes.object}}
        );
    });

    it('renders default add journal form', () => {
        const tree = toJson(app);
        expect(tree).toMatchSnapshot();
    });

});