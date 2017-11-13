jest.dontMock('./AuthorLinking');

import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import AuthorLinking from './AuthorLinking';

const contributorProps = {
    searchKey: {value: 'rek_contributor_id', order: 'rek_contributor_id_order', type: 'contributor'},
    authorList: [{
        "rek_contributor_id": null,
        "rek_contributor_pid": "UQ:654776",
        "rek_contributor": "Overgaard, Nana H.",
        "rek_contributor_order": 1
    }, {
        "rek_contributor_id": null,
        "rek_contributor_pid": "UQ:654776",
        "rek_contributor": "Cruz, Jazmina L.",
        "rek_contributor_order": 2
    }, {
        "rek_contributor_id": null,
        "rek_contributor_pid": "UQ:654776",
        "rek_contributor": "Bridge, Jennifer A.",
        "rek_contributor_order": 3
    }, {
        "rek_contributor_id": null,
        "rek_contributor_pid": "UQ:654776",
        "rek_contributor": "Nel, Hendrik J.",
        "rek_contributor_order": 4
    }]
};

function setup({author, linkedAuthorIdList, disabled, authorList}){
    const authorProps = {
        searchKey: {value: 'rek_author_id', order: 'rek_author_id_order', type: 'author'},
        loggedInAuthor: author || { aut_id: 410 },
        authorList: authorList || [{
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
        }],
        linkedAuthorIdList: linkedAuthorIdList || [],
        disabled: disabled || false
    };
    return shallow(<AuthorLinking {...authorProps} />);
}

describe('AuthorLinking', () => {
    it('should render all authors as unlinked and selectable', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render author Bridge as linked', () => {
        const wrapper = setup({ linkedAuthorIdList: [
            { "rek_author_id": 0, "rek_author_id_order": 1 },
            { "rek_author_id": 0, "rek_author_id_order": 2 },
            { "rek_author_id": 123, "rek_author_id_order": 3 },
            { "rek_author_id": 0, "rek_author_id_order": 4 },
            { "rek_author_id": 0, "rek_author_id_order": 5 },
            { "rek_author_id": 0, "rek_author_id_order": 6 },
            { "rek_author_id": 0, "rek_author_id_order": 7 },
            { "rek_author_id": 0, "rek_author_id_order": 8 },
            { "rek_author_id": 0, "rek_author_id_order": 9 },
        ] });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should be disabled', () => {
        const wrapper = setup({ disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('ContributorLinking', () => {
    it('should render all contributors as unlinked and selectable', () => {
        const wrapper = setup({ ...contributorProps });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render author Bridge as linked', () => {
        const wrapper = setup({ ...contributorProps, linkedAuthorIdList: [
            { "rek_contributor_id": 0, "rek_contributor_id_order": 1 },
            { "rek_contributor_id": 0, "rek_contributor_id_order": 2 },
            { "rek_contributor_id": 123, "rek_contributor_id_order": 3 },
            { "rek_contributor_id": 0, "rek_contributor_id_order": 4 },
            { "rek_contributor_id": 0, "rek_contributor_id_order": 5 },
            { "rek_contributor_id": 0, "rek_contributor_id_order": 6 },
            { "rek_contributor_id": 0, "rek_contributor_id_order": 7 },
            { "rek_contributor_id": 0, "rek_contributor_id_order": 8 },
            { "rek_contributor_id": 0, "rek_contributor_id_order": 9 },
        ] });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should be disabled', () => {
        const wrapper = setup({ ...contributorProps, disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
