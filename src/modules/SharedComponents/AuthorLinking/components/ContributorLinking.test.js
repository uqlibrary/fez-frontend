jest.dontMock('./AuthorLinking');

import React from 'react';
import AuthorLinking from './AuthorLinking';

const authorList = [
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

const linkedAuthorIdList = [
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

const searchKey = {value: 'rek_contributor_id', order: 'rek_contributor_id_order', type: 'contributor'};

function setup({linkedAuthorIdList}){
    const props = {
        searchKey: searchKey,
        author: {aut_id: 410},
        authorList: authorList,
        linkedAuthorIdList: linkedAuthorIdList || [],
        disabled: false
    };

    return new AuthorLinking({...props});
}

describe('AuthorLinking', () => {
    it('should prepare output correctly with linked contributor ids provided where logged in contributor id not present', () => {
        const component = setup({linkedAuthorIdList: linkedAuthorIdList});
        const preparedOutput = component.prepareOutput(
            {searchKey},
            {
                selectedAuthor: {
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: 'UQ:111111',
                    rek_contributor_id: 410,
                    rek_contributor_id_order: 6
                }
            },
            linkedAuthorIdList
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
        const component = setup({});
        const preparedOutput = component.prepareOutput(
            {searchKey},
            {
                selectedAuthor: {
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: 'UQ:111111',
                    rek_contributor_id: 410,
                    rek_contributor_id_order: 6
                }
            },
            authorList.map((author) => component.transformToAuthorOrderId(0, author))
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
