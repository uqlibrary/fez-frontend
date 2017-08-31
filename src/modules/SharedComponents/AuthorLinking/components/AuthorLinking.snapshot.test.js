jest.dontMock('./AuthorLinking');

import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import AuthorLinking from './AuthorLinking';

const authorList = [{
    "rek_author_id": null,
    "rek_author_pid": "UQ:654776",
    "rek_author": "Overgaard, Nana H.",
    "rek_author_order": 1
}, {
    "rek_author_id": null,
    "rek_author_pid": "UQ:654776",
    "rek_author": "Cruz, Jazmina L.",
    "rek_author_order": 2
}, {
    "rek_author_id": null,
    "rek_author_pid": "UQ:654776",
    "rek_author": "Bridge, Jennifer A.",
    "rek_author_order": 3
}, {
    "rek_author_id": null,
    "rek_author_pid": "UQ:654776",
    "rek_author": "Nel, Hendrik J.",
    "rek_author_order": 4
}, {
    "rek_author_id": null,
    "rek_author_pid": "UQ:654776",
    "rek_author": "Frazer, Ian H.",
    "rek_author_order": 5
}, {
    "rek_author_id": null,
    "rek_author_pid": "UQ:654776",
    "rek_author": "La Gruta, Nicole L.",
    "rek_author_order": 6
}, {
    "rek_author_id": null,
    "rek_author_pid": "UQ:654776",
    "rek_author": "Blumenthal, Antje",
    "rek_author_order": 7
}, {
    "rek_author_id": null,
    "rek_author_pid": "UQ:654776",
    "rek_author": "Steptoe, Raymond J.",
    "rek_author_order": 8
}, {
    "rek_author_id": null,
    "rek_author_pid": "UQ:654776",
    "rek_author": "Wells, James W.",
    "rek_author_order": 9
}];

function setup({author, linkedAuthorIdList, disabled}){
    const props = {
        searchKey: {value: 'rek_author_id', order: 'rek_author_id_order'},
        author: author || { aut_id: 410 },
        authorList: authorList,
        linkedAuthorIdList: linkedAuthorIdList || [],
        disabled: disabled || false
    };

    return shallow(<AuthorLinking {...props} />);
}

describe('AuthorLinking', () => {
    it('should render all authors as unlinked and selectable', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render author Bridge as linked and disabled', () => {
        const wrapper = setup({ linkedAuthorIdList: [{ "rek_author_id": 123, "rek_author_id_order": 3 }]});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should be disabled', () => {
        const wrapper = setup({ disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
