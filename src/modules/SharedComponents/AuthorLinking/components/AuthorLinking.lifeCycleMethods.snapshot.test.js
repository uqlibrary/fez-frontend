jest.dontMock('./AuthorLinking');
// jest.mock('draft-js/lib/generateRandomKey', () => () => '123');

import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import AuthorLinking from './AuthorLinking';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';

const searchKey = {value: 'rek_author_id', order: 'rek_author_id_order', type: 'author'};

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

describe('AuthorLinking', () => {
    it('should call componentDidMount life cycle method', () => {
        const props = {
            searchKey: searchKey,
            authorList: [
                {rek_author_id: null, rek_author_pid: "UQ:111111", rek_author: "Overgaard, Nana H.", rek_author_order: 1},
                {rek_author_id: null, rek_author_pid: "UQ:111111", rek_author: "Cruz, Jazmina L.", rek_author_order: 2}
            ],
            linkedAuthorIdList: [
                {rek_author_id_id: null, rek_author_id_pid: "UQ:111111", rek_author_id: 0, rek_author_id_order: 1},
                {rek_author_id_id: null, rek_author_id_pid: "UQ:111111", rek_author_id: 0, rek_author_id_order: 2}
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
                {rek_author_id: null, rek_author_pid: "UQ:111111", rek_author: "Overgaard, Nana H.", rek_author_order: 1},
                {rek_author_id: null, rek_author_pid: "UQ:111111", rek_author: "Cruz, Jazmina L.", rek_author_order: 2}
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
                {rek_author_id: null, rek_author_pid: "UQ:111111", rek_author: "Overgaard, Nana H.", rek_author_order: 1},
                {rek_author_id: null, rek_author_pid: "UQ:111111", rek_author: "Cruz, Jazmina L.", rek_author_order: 2}
            ],
            onChange: onChange
        };

        const wrapper = setup(props);
        wrapper.instance()._selectAuthor({rek_author_id: null, rek_author_pid: "UQ:111111", rek_author: "Overgaard, Nana H.", rek_author_order: 1});
        expect(onChange).toHaveBeenCalled();

        wrapper.instance()._acceptAuthorLinkingTermsAndConditions();
        expect(onChange).toHaveBeenCalled();
    });
});