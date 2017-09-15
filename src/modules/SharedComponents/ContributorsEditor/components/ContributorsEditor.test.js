jest.dontMock('./ContributorsEditor');

import { mount } from 'enzyme';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import {ContributorsEditor} from './ContributorsEditor';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import Immutable from 'immutable';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {authorsSearch} from 'mock/data/authors';

beforeAll(() => {
    injectTapEventPlugin();
});

const create = () => {
    const initialState = Immutable.Map();

    const store = {
        getState: jest.fn(() => (initialState)),
        dispatch: jest.fn(),
        subscribe: jest.fn()
    };
    const next = jest.fn();
    const invoke = (action) => thunk(store)(next)(action);
    return {store, next, invoke}
};

function setup({showIdentifierLookup, showContributorAssignment, className,
    disabled, author, onChange, isShallow = true}){

    const props = {
        showIdentifierLookup: showIdentifierLookup || false, // : PropTypes.bool,
        showContributorAssignment: showContributorAssignment || false, // : PropTypes.bool,
        className, // : PropTypes.string,
        disabled, // : PropTypes.bool,
        author: author || { aut_id: 1 }, // : PropTypes.object,
        onChange //: PropTypes.func,
        //locale: PropTypes.object
    };

    if (!isShallow) {
        return mount(
            <Provider store={create().store}>
                <ContributorsEditor {...props} />
            </Provider>, {
                context: {
                    muiTheme: getMuiTheme()
                },
                childContextTypes: {
                    muiTheme: PropTypes.object.isRequired
                }
            });
    }

    return shallow(<Provider store={create().store}><ContributorsEditor {...props} /></Provider>);
}



describe('ContributorsEditor tests ', () => {
    it('rendering full component with a defined className', () => {
        const wrapper = setup({ isShallow: false, className: 'requiredField' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('rendering full component with identifier lookup', () => {
        const wrapper = setup({ isShallow: false, showIdentifierLookup: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('appending a contributor to the list', () => {
        const wrapper = setup({}).find('ContributorsEditor').dive();
        expect(wrapper.state().contributors.length).toEqual(0);
        wrapper.instance().addContributor({displayName: "J.Smith"});
        expect(wrapper.state().contributors.length).toEqual(1);
    });

    it('appending a contributor with identifier to the list', () => {
        const wrapper = setup({}).find('ContributorsEditor').dive();
        expect(wrapper.state().contributors.length).toEqual(0);
        wrapper.instance().addContributor({displayName: "J.Smith", ...authorsSearch.data[0]});
        expect(wrapper.state().contributors.length).toEqual(1);
        expect(wrapper.state().isCurrentAuthorSelected).toEqual(false);
    });

    it('appending a contributor with duplicate identifier to the list', () => {
        const wrapper = setup({}).find('ContributorsEditor').dive();
        expect(wrapper.state().contributors.length).toEqual(0);
        wrapper.instance().addContributor({displayName: "J.Smith", ...authorsSearch.data[0]});
        expect(wrapper.state().contributors.length).toEqual(1);
        expect(wrapper.state().isCurrentAuthorSelected).toEqual(false);
        wrapper.instance().addContributor({displayName: "J.Smith II", ...authorsSearch.data[0]});
        expect(wrapper.state().contributors.length).toEqual(1);
    });

    it('appending a contributor with identifier who is a current author to the list', () => {
        const wrapper = setup({ author: authorsSearch.data[0] }).find('ContributorsEditor').dive();
        expect(wrapper.state().contributors.length).toEqual(0);
        wrapper.instance().addContributor({displayName: "J.Smith", ...authorsSearch.data[0]});
        expect(wrapper.state().contributors.length).toEqual(1);
        expect(wrapper.state().isCurrentAuthorSelected).toEqual(true);
    });

    it('assigning a contributor to current author', () => {
        const wrapper = setup({}).find('ContributorsEditor').dive();
        wrapper.setState({ contributors: [{}, {}, {}], isCurrentAuthorSelected: false });
        expect(wrapper.state().contributors.length).toEqual(3);
        expect(wrapper.state().contributors[0].selected).toBeFalsy();
        wrapper.instance().assignContributor({}, 0);
        expect(wrapper.state().contributors.length).toEqual(3);
        expect(wrapper.state().contributors[0].selected).toEqual(true);
    });

    it('deleting a contributor from the list', () => {
        const wrapper = setup({}).find('ContributorsEditor').dive();
        wrapper.setState({ contributors: [ {}, {}, {}], isCurrentAuthorSelected: true });
        expect(wrapper.state().contributors.length).toEqual(3);
        wrapper.instance().deleteContributor({}, 0);
        expect(wrapper.state().contributors.length).toEqual(2);
    });

    it('deleting all contributors from a list', () => {
        const wrapper = setup({}).find('ContributorsEditor').dive();
        wrapper.setState({ contributors: [ {}, {}, {}], isCurrentAuthorSelected: true });
        expect(wrapper.state().contributors.length).toEqual(3);
        wrapper.instance().deleteAllContributors();
        expect(wrapper.state().contributors.length).toEqual(0);
        expect(wrapper.state().isCurrentAuthorSelected).toEqual(false);
    });

    it('moving up a contributor', () => {
        const wrapper = setup({}).find('ContributorsEditor').dive();
        wrapper.setState({ contributors: [ {displayName: 1}, {displayName: 2}, {displayName: 3}]});
        expect(wrapper.state().contributors.length).toEqual(3);
        expect(wrapper.state().contributors[1].displayName).toEqual(2);
        wrapper.instance().moveUpContributor({}, 1);
        expect(wrapper.state().contributors.length).toEqual(3);
        expect(wrapper.state().contributors[1].displayName).toEqual(1);
    });

    it('moving down a contributor', () => {
        const wrapper = setup({}).find('ContributorsEditor').dive();
        wrapper.setState({ contributors: [ {displayName: 1}, {displayName: 2}, {displayName: 3}]});
        expect(wrapper.state().contributors.length).toEqual(3);
        expect(wrapper.state().contributors[1].displayName).toEqual(2);
        wrapper.instance().moveDownContributor({}, 1);
        expect(wrapper.state().contributors.length).toEqual(3);
        expect(wrapper.state().contributors[1].displayName).toEqual(3);
    });
});
