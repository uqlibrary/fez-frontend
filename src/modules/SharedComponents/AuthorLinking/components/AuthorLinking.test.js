import React from 'react';
import AuthorLinking from './AuthorLinking';
import { render, fireEvent } from 'test-utils';

import * as Hook from 'hooks/useWidth';

function setup(testProps = {}) {
    const props = {
        authorLinkingId: 'rek-author-id',
        loggedInAuthor: { aut_id: 410 },
        authorList: [],
        disabled: false,
        onChange: jest.fn(),
        searchKey: {
            value: 'rek_author_id',
            order: 'rek_author_id_order',
            type: 'author',
        },
        ...testProps,
    };
    return render(<AuthorLinking {...props} />);
}

// Authors

const linkedAuthorIdList = [
    { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 1 },
    { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 2 },
    { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 3 },
    { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 4 },
    { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 5 },
    { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 6 },
    { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 7 },
    { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 123, rek_author_id_order: 8 },
    { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 9 },
];
const authorList = [
    { rek_author_id: null, rek_author_pid: 'UQ:111111', rek_author: 'Overgaard, Nana H.', rek_author_order: 1 },
    { rek_author_id: null, rek_author_pid: 'UQ:111111', rek_author: 'Cruz, Jazmina L.', rek_author_order: 2 },
    { rek_author_id: null, rek_author_pid: 'UQ:111111', rek_author: 'Bridge, Jennifer A.', rek_author_order: 3 },
    { rek_author_id: null, rek_author_pid: 'UQ:111111', rek_author: 'Nel, Hendrik J.', rek_author_order: 4 },
    { rek_author_id: null, rek_author_pid: 'UQ:111111', rek_author: 'Frazer, Ian H.', rek_author_order: 5 },
    { rek_author_id: null, rek_author_pid: 'UQ:111111', rek_author: 'La Gruta, Nicole L.', rek_author_order: 6 },
    { rek_author_id: null, rek_author_pid: 'UQ:111111', rek_author: 'Blumenthal, Antje', rek_author_order: 7 },
    { rek_author_id: null, rek_author_pid: 'UQ:111111', rek_author: 'Steptoe, Raymond J.', rek_author_order: 8 },
    { rek_author_id: null, rek_author_pid: 'UQ:111111', rek_author: 'Wells, James W.', rek_author_order: 9 },
];

describe('AuthorLinking', () => {
    it('should correctly call onChange callback with correct output data', () => {
        const onChangeFn = jest.fn();
        const { getByTestId } = setup({
            authorList: authorList,
            linkedAuthorIdList: linkedAuthorIdList,
            onChange: onChangeFn,
        });

        fireEvent.click(getByTestId('rek-author-id-5'));

        expect(onChangeFn).toHaveBeenCalledWith({
            authors: [
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 1 },
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 2 },
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 3 },
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 4 },
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 5 },
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 410, rek_author_id_order: 6 },
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 7 },
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 123, rek_author_id_order: 8 },
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 9 },
            ],
            valid: false,
        });
    });

    it('should correctly call onChange callback with empty linked author id list', () => {
        const onChangeFn = jest.fn();
        const { getByTestId } = setup({
            authorList: authorList,
            onChange: onChangeFn,
        });

        fireEvent.click(getByTestId('rek-author-id-5'));

        expect(onChangeFn).toHaveBeenCalledWith({
            authors: [
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 1 },
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 2 },
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 3 },
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 4 },
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 5 },
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 410, rek_author_id_order: 6 },
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 7 },
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 8 },
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 9 },
            ],
            valid: false,
        });
    });

    it('should correctly call onChange callback with author order not start from 1', () => {
        const onChangeFn = jest.fn();
        const { getByTestId } = setup({
            onChange: onChangeFn,
            authorList: [
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:111111',
                    rek_author: 'Cruz, Jazmina L.',
                    rek_author_order: 2,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:111111',
                    rek_author: 'Bridge, Jennifer A.',
                    rek_author_order: 3,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:111111',
                    rek_author: 'Nel, Hendrik J.',
                    rek_author_order: 4,
                },
            ],
        });

        fireEvent.click(getByTestId('rek-author-id-1'));

        expect(onChangeFn).toHaveBeenCalledWith({
            authors: [
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 2 },
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 410, rek_author_id_order: 3 },
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 4 },
            ],
            valid: false,
        });

        fireEvent.click(getByTestId('author-accept-declaration-input'));

        expect(onChangeFn).toHaveBeenCalledWith({
            authors: [
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 2 },
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 410, rek_author_id_order: 3 },
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 4 },
            ],
            valid: true,
        });
    });

    it('should correctly render number of authors per row for width=sm', () => {
        const useWidth = jest.spyOn(Hook, 'useWidth');

        useWidth.mockImplementation(() => 'sm');

        const onChangeFn = jest.fn();

        const { getByTestId, queryByTestId } = setup({
            authorList: authorList,
            onChange: onChangeFn,
        });

        expect(getByTestId('rek-author-id-row-0')).toBeInTheDocument();
        expect(getByTestId('rek-author-id-row-1')).toBeInTheDocument();
        expect(getByTestId('rek-author-id-row-2')).toBeInTheDocument();
        expect(getByTestId('rek-author-id-row-3')).toBeInTheDocument();
        expect(getByTestId('rek-author-id-row-4')).toBeInTheDocument();
        expect(queryByTestId('rek-author-id-row-5')).not.toBeInTheDocument();
    });

    it('should correctly render number of authors per row for width=md', () => {
        const useWidth = jest.spyOn(Hook, 'useWidth');

        useWidth.mockImplementation(() => 'md');

        const onChangeFn = jest.fn();

        const { getByTestId, queryByTestId } = setup({
            authorList: authorList,
            onChange: onChangeFn,
        });

        expect(getByTestId('rek-author-id-row-0')).toBeInTheDocument();
        expect(getByTestId('rek-author-id-row-1')).toBeInTheDocument();
        expect(getByTestId('rek-author-id-row-2')).toBeInTheDocument();
        expect(queryByTestId('rek-author-id-row-3')).not.toBeInTheDocument();
    });
});
