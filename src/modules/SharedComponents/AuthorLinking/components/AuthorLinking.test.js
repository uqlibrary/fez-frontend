jest.dontMock('./AuthorLinking');

import React from 'react';
import AuthorLinking from './AuthorLinking';

function setup({searchKey, author, authorList, linkedAuthorIdList, disabled}){
    const props = {
        searchKey: searchKey || {},
        author: author || {aut_id: 410},
        authorList: authorList || [],
        linkedAuthorIdList: linkedAuthorIdList,
        disabled: disabled || false
    };
    return new AuthorLinking({...props});
}

// Authors

const linkedAuthorIdList = [
    {rek_author_id_id: null, rek_author_id_pid: "UQ:111111", rek_author_id: 0, rek_author_id_order: 1},
    {rek_author_id_id: null, rek_author_id_pid: "UQ:111111", rek_author_id: 0, rek_author_id_order: 2},
    {rek_author_id_id: null, rek_author_id_pid: "UQ:111111", rek_author_id: 0, rek_author_id_order: 3},
    {rek_author_id_id: null, rek_author_id_pid: "UQ:111111", rek_author_id: 0, rek_author_id_order: 4},
    {rek_author_id_id: null, rek_author_id_pid: "UQ:111111", rek_author_id: 0, rek_author_id_order: 5},
    {rek_author_id_id: null, rek_author_id_pid: "UQ:111111", rek_author_id: 0, rek_author_id_order: 6},
    {rek_author_id_id: null, rek_author_id_pid: "UQ:111111", rek_author_id: 0, rek_author_id_order: 7},
    {rek_author_id_id: null, rek_author_id_pid: "UQ:111111", rek_author_id: 123, rek_author_id_order: 8},
    {rek_author_id_id: null, rek_author_id_pid: "UQ:111111", rek_author_id: 0, rek_author_id_order: 9}
];
const authorList = [
    {rek_author_id: null, rek_author_pid: "UQ:111111", rek_author: "Overgaard, Nana H.", rek_author_order: 1},
    {rek_author_id: null, rek_author_pid: "UQ:111111", rek_author: "Cruz, Jazmina L.", rek_author_order: 2},
    {rek_author_id: null, rek_author_pid: "UQ:111111", rek_author: "Bridge, Jennifer A.", rek_author_order: 3},
    {rek_author_id: null, rek_author_pid: "UQ:111111", rek_author: "Nel, Hendrik J.", rek_author_order: 4},
    {rek_author_id: null, rek_author_pid: "UQ:111111", rek_author: "Frazer, Ian H.", rek_author_order: 5},
    {rek_author_id: null, rek_author_pid: "UQ:111111", rek_author: "La Gruta, Nicole L.", rek_author_order: 6},
    {rek_author_id: null, rek_author_pid: "UQ:111111", rek_author: "Blumenthal, Antje", rek_author_order: 7},
    {rek_author_id: null, rek_author_pid: "UQ:111111", rek_author: "Steptoe, Raymond J.", rek_author_order: 8},
    {rek_author_id: null, rek_author_pid: "UQ:111111", rek_author: "Wells, James W.", rek_author_order: 9 }
];
const searchKey = {value: 'rek_author_id', order: 'rek_author_id_order', type: 'author'};

describe('AuthorLinking', () => {
    it('should prepare output correctly with linked author ids provided where logged in author id not present', () => {
        const component = setup({});
        const preparedOutput = component.prepareOutput(
            {searchKey},
            {
                selectedAuthor: {
                    rek_author_id_id: null,
                    rek_author_id_pid: 'UQ:111111',
                    rek_author_id: 410,
                    rek_author_id_order: 6
                },
            },
            linkedAuthorIdList
        );

        expect(preparedOutput).toEqual([
            {rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 1},
            {rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 2},
            {rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 3},
            {rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 4},
            {rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 5},
            {rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 410, rek_author_id_order: 6},
            {rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 7},
            {rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 123, rek_author_id_order: 8},
            {rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 9}
        ]);
    });

    it('should prepare output correctly with empty linked author id list', () => {
        const component = setup({});
        const preparedOutput = component.prepareOutput(
            {searchKey},
            {
                selectedAuthor: {
                    rek_author_id_id: null,
                    rek_author_id_pid: 'UQ:111111',
                    rek_author_id: 410,
                    rek_author_id_order: 6
                },
            },
            authorList.map((author) => component.transformToAuthorOrderId(0, author, searchKey))
        );

        expect(preparedOutput).toEqual([
            {rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 1},
            {rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 2},
            {rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 3},
            {rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 4},
            {rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 5},
            {rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 410, rek_author_id_order: 6},
            {rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 7},
            {rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 8},
            {rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 9}
        ]);
    });
});

// Contributors
const linkedContributorIdList = [
    {rek_contributor_id_id: null, rek_contributor_id_pid: "UQ:111111", rek_contributor_id: 0, rek_contributor_id_order: 1},
    {rek_contributor_id_id: null, rek_contributor_id_pid: "UQ:111111", rek_contributor_id: 0, rek_contributor_id_order: 2},
    {rek_contributor_id_id: null, rek_contributor_id_pid: "UQ:111111", rek_contributor_id: 0, rek_contributor_id_order: 3},
    {rek_contributor_id_id: null, rek_contributor_id_pid: "UQ:111111", rek_contributor_id: 0, rek_contributor_id_order: 4},
    {rek_contributor_id_id: null, rek_contributor_id_pid: "UQ:111111", rek_contributor_id: 0, rek_contributor_id_order: 5},
    {rek_contributor_id_id: null, rek_contributor_id_pid: "UQ:111111", rek_contributor_id: 0, rek_contributor_id_order: 6},
    {rek_contributor_id_id: null, rek_contributor_id_pid: "UQ:111111", rek_contributor_id: 0, rek_contributor_id_order: 7},
    {rek_contributor_id_id: null, rek_contributor_id_pid: "UQ:111111", rek_contributor_id: 123, rek_contributor_id_order: 8},
    {rek_contributor_id_id: null, rek_contributor_id_pid: "UQ:111111", rek_contributor_id: 0, rek_contributor_id_order: 9}
];
const contributorList = [
    {rek_contributor_id: null, rek_contributor_pid: "UQ:111111", rek_author: "Overgaard, Nana H.", rek_contributor_order: 1},
    {rek_contributor_id: null, rek_contributor_pid: "UQ:111111", rek_author: "Cruz, Jazmina L.", rek_contributor_order: 2},
    {rek_contributor_id: null, rek_contributor_pid: "UQ:111111", rek_author: "Bridge, Jennifer A.", rek_contributor_order: 3},
    {rek_contributor_id: null, rek_contributor_pid: "UQ:111111", rek_author: "Nel, Hendrik J.", rek_contributor_order: 4},
    {rek_contributor_id: null, rek_contributor_pid: "UQ:111111", rek_author: "Frazer, Ian H.", rek_contributor_order: 5},
    {rek_contributor_id: null, rek_contributor_pid: "UQ:111111", rek_author: "La Gruta, Nicole L.", rek_contributor_order: 6},
    {rek_contributor_id: null, rek_contributor_pid: "UQ:111111", rek_author: "Blumenthal, Antje", rek_contributor_order: 7},
    {rek_contributor_id: null, rek_contributor_pid: "UQ:111111", rek_author: "Steptoe, Raymond J.", rek_contributor_order: 8},
    {rek_contributor_id: null, rek_contributor_pid: "UQ:111111", rek_author: "Wells, James W.", rek_contributor_order: 9 }
];
const contributorSearchKey = {value: 'rek_contributor_id', order: 'rek_contributor_id_order', type: 'contributor'};

describe('ContributorLinking', () => {
    it('should prepare output correctly with linked contributor ids provided where logged in author id not present', () => {
        const component = setup({});
        const preparedOutput = component.prepareOutput(
            {searchKey: contributorSearchKey},
            {
                selectedAuthor: {
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: 'UQ:111111',
                    rek_contributor_id: 410,
                    rek_contributor_id_order: 6
                },
            },
            linkedContributorIdList
        );

        expect(preparedOutput).toEqual([
            {rek_contributor_id_id: null, rek_contributor_id_pid: 'UQ:111111', rek_contributor_id: 0, rek_contributor_id_order: 1},
            {rek_contributor_id_id: null, rek_contributor_id_pid: 'UQ:111111', rek_contributor_id: 0, rek_contributor_id_order: 2},
            {rek_contributor_id_id: null, rek_contributor_id_pid: 'UQ:111111', rek_contributor_id: 0, rek_contributor_id_order: 3},
            {rek_contributor_id_id: null, rek_contributor_id_pid: 'UQ:111111', rek_contributor_id: 0, rek_contributor_id_order: 4},
            {rek_contributor_id_id: null, rek_contributor_id_pid: 'UQ:111111', rek_contributor_id: 0, rek_contributor_id_order: 5},
            {rek_contributor_id_id: null, rek_contributor_id_pid: 'UQ:111111', rek_contributor_id: 410, rek_contributor_id_order: 6},
            {rek_contributor_id_id: null, rek_contributor_id_pid: 'UQ:111111', rek_contributor_id: 0, rek_contributor_id_order: 7},
            {rek_contributor_id_id: null, rek_contributor_id_pid: 'UQ:111111', rek_contributor_id: 123, rek_contributor_id_order: 8},
            {rek_contributor_id_id: null, rek_contributor_id_pid: 'UQ:111111', rek_contributor_id: 0, rek_contributor_id_order: 9}
        ]);
    });

    it('should prepare output correctly with empty linked author id list', () => {
        const component = setup({});
        const preparedOutput = component.prepareOutput(
            {searchKey: contributorSearchKey},
            {
                selectedAuthor: {
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: 'UQ:111111',
                    rek_contributor_id: 410,
                    rek_contributor_id_order: 6
                },
            },
            contributorList.map((author) => component.transformToAuthorOrderId(0, author, contributorSearchKey))
        );

        expect(preparedOutput).toEqual([
            {rek_contributor_id_id: null, rek_contributor_id_pid: 'UQ:111111', rek_contributor_id: 0, rek_contributor_id_order: 1},
            {rek_contributor_id_id: null, rek_contributor_id_pid: 'UQ:111111', rek_contributor_id: 0, rek_contributor_id_order: 2},
            {rek_contributor_id_id: null, rek_contributor_id_pid: 'UQ:111111', rek_contributor_id: 0, rek_contributor_id_order: 3},
            {rek_contributor_id_id: null, rek_contributor_id_pid: 'UQ:111111', rek_contributor_id: 0, rek_contributor_id_order: 4},
            {rek_contributor_id_id: null, rek_contributor_id_pid: 'UQ:111111', rek_contributor_id: 0, rek_contributor_id_order: 5},
            {rek_contributor_id_id: null, rek_contributor_id_pid: 'UQ:111111', rek_contributor_id: 410, rek_contributor_id_order: 6},
            {rek_contributor_id_id: null, rek_contributor_id_pid: 'UQ:111111', rek_contributor_id: 0, rek_contributor_id_order: 7},
            {rek_contributor_id_id: null, rek_contributor_id_pid: 'UQ:111111', rek_contributor_id: 0, rek_contributor_id_order: 8},
            {rek_contributor_id_id: null, rek_contributor_id_pid: 'UQ:111111', rek_contributor_id: 0, rek_contributor_id_order: 9}
        ]);
    });
});
