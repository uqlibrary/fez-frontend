jest.dontMock('./AuthorLinking');

import React from 'react';
import AuthorLinking from './AuthorLinking';

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

// Authors

const authorsSearchKey = {value: 'rek_author_id', order: 'rek_author_id_order', type: 'author'};

function setupAuthor({linkedAuthorIdList}){
    const props = {
        searchKey: authorsSearchKey,
        author: {aut_id: 410},
        authorList: authorList,
        linkedAuthorIdList: linkedAuthorIdList || [],
        disabled: false
    };

    return new AuthorLinking({...props});
}

describe('AuthorLinking', () => {
    it('should prepare output correctly with linked author ids provided where logged in author id not present', () => {
        const component = setupAuthor({linkedAuthorIdList: linkedAuthorIdList});
        const preparedOutput = component.prepareOutput(
            {searchKey: authorsSearchKey},
            {
                selectedAuthor: {
                    rek_author_id_id: null,
                    rek_author_id_pid: 'UQ:111111',
                    rek_author_id: 410,
                    rek_author_id_order: 6
                }
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
        const component = setupAuthor({});
        const preparedOutput = component.prepareOutput(
            {searchKey: authorsSearchKey},
            {
                selectedAuthor: {
                    rek_author_id_id: null,
                    rek_author_id_pid: 'UQ:111111',
                    rek_author_id: 410,
                    rek_author_id_order: 6
                }
            },
            authorList.map((author) => component.transformToAuthorOrderId(0, author))
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

const contributorList = [
    {rek_contributor_id: null, rek_contributor_pid: "UQ:111111", rek_contributor: "Overgaard, Nana H.", rek_contributor_order: 1},
    {rek_contributor_id: null, rek_contributor_pid: "UQ:111111", rek_contributor: "Cruz, Jazmina L.", rek_contributor_order: 2},
    {rek_contributor_id: null, rek_contributor_pid: "UQ:111111", rek_contributor: "Bridge, Jennifer A.", rek_contributor_order: 3},
    {rek_contributor_id: null, rek_contributor_pid: "UQ:111111", rek_contributor: "Nel, Hendrik J.", rek_contributor_order: 4},
    {rek_contributor_id: null, rek_contributor_pid: "UQ:111111", rek_contributor: "Frazer, Ian H.", rek_contributor_order: 5},
    {rek_contributor_id: null, rek_contributor_pid: "UQ:111111", rek_contributor: "La Gruta, Nicole L.", rek_contributor_order: 6},
    {rek_contributor_id: null, rek_contributor_pid: "UQ:111111", rek_contributor: "Blumenthal, Antje", rek_contributor_order: 7},
    {rek_contributor_id: null, rek_contributor_pid: "UQ:111111", rek_contributor: "Steptoe, Raymond J.", rek_contributor_order: 8},
    {rek_contributor_id: null, rek_contributor_pid: "UQ:111111", rek_contributor: "Wells, James W.", rek_contributor_order: 9 }
];
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
const contributorsSearchKey = {value: 'rek_contributor_id', order: 'rek_contributor_id_order', type: 'contributor'};

function setupContributor({linkedContributorIdList}){
    const props = {
        searchKey: contributorsSearchKey,
        author: {aut_id: 410},
        authorList: contributorList,
        linkedAuthorIdList: linkedContributorIdList || [],
        disabled: false
    };

    return new AuthorLinking({...props});
}

describe('ContributorLinking', () => {
    it('should prepare output correctly with linked contributor ids provided where logged in author id not present', () => {
        const component = setupContributor({linkedAuthorIdList: linkedContributorIdList});
        const preparedOutput = component.prepareOutput(
            {searchKey: contributorsSearchKey},
            {
                selectedAuthor: {
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: 'UQ:111111',
                    rek_contributor_id: 410,
                    rek_contributor_id_order: 6
                }
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

    it('should prepare output correctly with empty linked contributor id list', () => {
        const component = setupContributor({});
        const preparedOutput = component.prepareOutput(
            {searchKey: contributorsSearchKey},
            {
                selectedAuthor: {
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: 'UQ:111111',
                    rek_contributor_id: 410,
                    rek_contributor_id_order: 6
                }
            },
            contributorList.map((author) => component.transformToAuthorOrderId(0, author))
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
