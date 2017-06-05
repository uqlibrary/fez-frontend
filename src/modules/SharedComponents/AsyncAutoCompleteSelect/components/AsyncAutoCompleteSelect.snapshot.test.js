jest.dontMock('./AsyncAutoCompleteSelect.component');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import AsyncAutoCompleteSelect from './AsyncAutoCompleteSelect.component';

function setup() {
    const authorsList = [
        {'id': 28990186, 'name': 'Churilov, Leonid'},
        {'id': 28990188, 'name': 'Gundlach, Andrew L.'},
        {'id': 28990185, 'name': 'Hossain, Mohammed Akhter'},
        {'id': 28990182, 'name': 'Kastman, Hanna E.'}
    ];

    const props = {
        name: 'authorName',
        label: 'some label',
        dataSourceLabel: 'name',
        dataSource: authorsList,
        disabled: false,
        disable: false,
    };
    return shallow(<AsyncAutoCompleteSelect {...props} />);
}

describe('AuthorRow snapshots testx', () => {
    it('renders an Author Rowx', () => {
        const wrapper = setup();
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});
