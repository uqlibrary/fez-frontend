jest.dontMock('../components/Authors');

import {reduxForm} from 'redux-form';
import Authors from '../components/Authors';
import React from 'react';
import PropTypes from 'prop-types';

import {mount} from 'enzyme';
import sinon from 'sinon';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Immutable from 'immutable';

import {reducer as formReducer} from 'redux-form';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import authorsReducer from '../reducer';

// otherwise it throws an 'Unknown prop `onTouchTap` on <div> tag.' error during the test
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

let addAuthor;
let removeAuthor;
let clearAuthors;
let selectedAuthors;
let app;

describe('Authors', () => {
    beforeEach(() => {
        const store = createStore(combineReducers({form: formReducer, authors: authorsReducer}));
        addAuthor = sinon.spy();
        removeAuthor = sinon.spy();
        clearAuthors = sinon.spy();
        const authors = Immutable.fromJS([
            {'id': 202, 'name': 'Author 8'},
            {'id': 263, 'name': 'Author 9'},
            {'id': 174, 'name': 'Author 10'},
            {'id': 177, 'name': 'Author 11'}
        ]);

        selectedAuthors = Immutable.fromJS([
            {'id': 202, 'name': 'Author 8'},
            {'id': 263, 'name': 'Author 9'}
        ]);

        const props = {
            addAuthor,
            removeAuthor,
            selectedAuthors,
            clearAuthors,
            dataSource: authors,
            form: 'atestform',
            formValues: Immutable.fromJS({authorName: 177})

        };

        const muiTheme = getMuiTheme();
        const Decorated = reduxForm({ form: 'testForm' })(Authors);
        app = mount(
            <Provider store={store}>
                <Decorated {...props} />
            </Provider>,
            { context: {muiTheme},
                childContextTypes: {muiTheme: PropTypes.object}}
        );
    });

    it('renders nested components', () => {
        expect(app.find('RaisedButton').toBeDefined);
        expect(app.find('AutoCompleteSelectWrapper').toBeDefined);
    });

    it('adds an author to the list', () => {
        const button = app.find('RaisedButton').first();
        const input = app.find('AutoCompleteSelectWrapper').first();
        input.simulate('change', { target: { value: 'Author 10' } });

        // trigger a real click as the this.addAuthor function is internal to the component
        // ie it's not passed as a prop which means we can't simulate the click
        button.props().onClick();
        expect(addAuthor.called).toEqual(true);
        expect(addAuthor.callCount).toEqual(1);
    });

    it('removes an author from the list', () => {
        const authorRows = app.find('AuthorRow');
        expect(authorRows.length).toEqual(selectedAuthors.size);

        const selectedAuthor = app.find('AuthorRow').first();
        selectedAuthor.props().removeAuthor(0);

        expect(removeAuthor.called).toEqual(true);
        expect(removeAuthor.callCount).toEqual(1);
    });
});
