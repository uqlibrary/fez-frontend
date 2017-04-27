jest.dontMock('./PublicationSearchForm');

import React from 'react';
import {mount} from 'enzyme';
import PropTypes from 'prop-types';

import {reduxForm} from 'redux-form';
import {reducer as formReducer} from 'redux-form';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import sinon from 'sinon';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import PublicationSearchForm from './PublicationSearchForm';
import publicationSearchReducer from '../reducer';

// otherwise it throws an 'Unknown prop `onTouchTap` on <div> tag.' error during the test
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

let handleSubmit;
let app;

function tester(app, inputValue, result) {
    const input = app.find({name: 'doiSearch'}).first();
    input.simulate('change', { target: { value: inputValue } });
    input.simulate('blur');

    const button = app.update().find('RaisedButton').first().simulate('submit');

    expect(button.props().label).toEqual(result);
    expect(handleSubmit.called).toEqual(true);
    expect(handleSubmit.callCount).toEqual(1);
}

describe('Publication search form integration tests', () => {
    beforeEach(() => {
        const store = createStore(combineReducers({form: formReducer, publicationSearch: publicationSearchReducer}));

        const muiTheme = getMuiTheme();
        const Decorated = reduxForm({ form: 'testForm' })(PublicationSearchForm);

        handleSubmit = sinon.spy();
        const props = {
            helpTitle: 'Help Title',
            helpText: 'Lorem Ipsum',
            title: 'Component Title',
            explanationText: 'Component Search Text',
            handleSubmit: handleSubmit
        };

        app = mount(
            <Provider store={store}>
                <Decorated {...props} />
            </Provider>,
            { context: {muiTheme},
                childContextTypes: {muiTheme: PropTypes.object}}
        );
    });

    it('sets the search button to PubMed Id Search', () => {
        tester(app, '123456', 'Pubmed Id Search');
    });

    it('sets the search button to Title Search', () => {
        tester(app, 'test', 'Title Search');
    });

    it('sets the search button to Doi Search', () => {
        tester(app, '10.1163/9789004326828', 'Doi Search');
    });
});
