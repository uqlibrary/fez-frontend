jest.dontMock('./AuthorLinking');

import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import AuthorLinking from './AuthorLinking';

const contributorList = [{
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
}];

function setup({author, linkedAuthorIdList, disabled}){
    const props = {
        searchKey: {value: 'rek_contributor_id', order: 'rek_contributor_id_order', type: 'contributor'},
        loggedInAuthor: author || { aut_id: 410 },
        authorList: contributorList,
        linkedAuthorIdList: linkedAuthorIdList || [],
        disabled: disabled || false
    };

    return shallow(<AuthorLinking {...props} />);
}

describe('ContributorLinking', () => {
    it('should render all contributors as unlinked and selectable', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render author Bridge as linked and disabled', () => {
        const wrapper = setup({ linkedAuthorIdList: [
            { "rek_contributor_id": 0, "rek_contributor_id_order": 1 },
            { "rek_contributor_id": 0, "rek_contributor_id_order": 2 },
            { "rek_contributor_id": 123, "rek_contributor_id_order": 3 },
            { "rek_contributor_id": 0, "rek_contributor_id_order": 4 },
            { "rek_contributor_id": 0, "rek_contributor_id_order": 5 },
            { "rek_contributor_id": 0, "rek_contributor_id_order": 6 },
            { "rek_contributor_id": 0, "rek_contributor_id_order": 7 },
            { "rek_contributor_id": 0, "rek_contributor_id_order": 8 },
            { "rek_contributor_id": 0, "rek_contributor_id_order": 9 },
        ]});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should be disabled', () => {
        const wrapper = setup({ disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
