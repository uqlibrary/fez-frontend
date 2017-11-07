jest.dontMock('./AuthorLinking');
// jest.mock('draft-js/lib/generateRandomKey', () => () => '123');

import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import AuthorLinking from './AuthorLinking';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';

const searchKey = {value: 'rek_contributor_id', order: 'rek_contributor_id_order', type: 'contributor'};

function setup(props) {
    return mount(<AuthorLinking {...props} />, {
        context: {
            muiTheme: getMuiTheme()
        },
        childContextTypes: {
            muiTheme: PropTypes.object.isRequired
        }
    });
}

beforeAll(() => {
    injectTapEventPlugin();
});

describe('ContributorLinking', () => {
    it('should call componentDidMount life cycle method', () => {
        const props = {
            searchKey: searchKey,
            authorList: [
                {rek_contributor_id: null, rek_contributor_pid: "UQ:111111", rek_contributor: "Overgaard, Nana H.", rek_contributor_order: 1},
                {rek_contributor_id: null, rek_contributor_pid: "UQ:111111", rek_contributor: "Cruz, Jazmina L.", rek_contributor_order: 2}
            ],
            linkedAuthorIdList: [
                {rek_contributor_id_id: null, rek_contributor_id_pid: "UQ:111111", rek_contributor_id: 0, rek_contributor_id_order: 1},
                {rek_contributor_id_id: null, rek_contributor_id_pid: "UQ:111111", rek_contributor_id: 0, rek_contributor_id_order: 2}
            ]
        };

        const wrapper = setup(props);
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should call componentDidMount life cycle method', () => {
        const props = {
            searchKey: searchKey,
            authorList: [
                {rek_contributor_id: null, rek_contributor_pid: "UQ:111111", rek_contributor: "Overgaard, Nana H.", rek_contributor_order: 1},
                {rek_contributor_id: null, rek_contributor_pid: "UQ:111111", rek_contributor: "Cruz, Jazmina L.", rek_contributor_order: 2}
            ]
        };

        const wrapper = setup(props);
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should call componentWillUpdate life cycle method on author selected', () => {
        const onChange = jest.fn();
        const props = {
            searchKey: searchKey,
            loggedInAuthor: {aut_id: 111},
            authorList: [
                {rek_contributor_id: null, rek_contributor_pid: "UQ:111111", rek_contributor: "Overgaard, Nana H.", rek_contributor_order: 1},
                {rek_contributor_id: null, rek_contributor_pid: "UQ:111111", rek_contributor: "Cruz, Jazmina L.", rek_contributor_order: 2}
            ],
            onChange: onChange
        };

        const wrapper = setup(props);
        wrapper.instance()._selectAuthor({rek_contributor_id: null, rek_contributor_pid: "UQ:111111", rek_contributor: "Overgaard, Nana H.", rek_contributor_order: 1});
        expect(onChange).toHaveBeenCalled();

        wrapper.instance()._acceptAuthorLinkingTermsAndConditions();
        expect(onChange).toHaveBeenCalled();
    });
});