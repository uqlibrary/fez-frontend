jest.dontMock('./AddJournalArticleForm');

import React from 'react';
import {mount} from 'enzyme';
import toJson from 'enzyme-to-json';

import {createStore} from 'redux';
import {Provider} from 'react-redux';
import Immutable from 'immutable';
import {Authors} from 'uqlibrary-react-toolbox';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

import AddJournalArticleForm from './AddJournalArticleForm';

// otherwise it throws an 'Unknown prop `onTouchTap` on <div> tag.' error during the test
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

let app;

// http://engineering.pivotal.io/post/stub-dont-shallow-render-your-child-components/
const lifecycleMethods = [
    'render',
    'componentWillMount',
    'componentDidMount',
    'componentWillReceiveProps',
    'shouldComponentUpdate',
    'componentWillUpdate',
    'componentDidUpdate',
    'componentWillUnmount'
];

const stubComponent = (componentClass) => {
    beforeEach(() => {
        for (const method of lifecycleMethods) {
            if (typeof componentClass.prototype[method] !== 'undefined') {
                jest.spyOn(componentClass.prototype, method).mockImplementation(() => {return null;});
            }
        }
    });
};


describe('Add journal form integration tests', () => {
    stubComponent(Authors);
    beforeEach(() => {
        const store = createStore(jest.fn());
        const muiTheme = getMuiTheme();

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
            loadAuthorData: jest.fn()
        };

        app = mount(
            <Provider store={store}>
                <AddJournalArticleForm {...props} />
            </Provider>,
            { context: {muiTheme},
                childContextTypes: {muiTheme: React.PropTypes.object}}
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders default add journal form', () => {
        app.setState({subTypeValue: 1});
        expect(toJson(app)).toMatchSnapshot();
    });
});
