import { AuthorLinking } from './AuthorLinking';

function setup(testProps = {}) {
    const props = {
        searchKey: testProps.searchKey || {},
        author: testProps.author || { aut_id: 410 },
        authorList: testProps.authorList || [],
        linkedAuthorIdList: testProps.linkedAuthorIdList,
        disabled: testProps.disabled || false,
        classes: {
            root: 'root',
            label: 'label',
            checkboxRoot: 'checkboxRoot',
            checkboxChecked: 'checkboxChecked',
        },
        ...testProps,
    };
    return getElement(AuthorLinking, props);
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
const searchKey = { value: 'rek_author_id', order: 'rek_author_id_order', type: 'author' };

describe('AuthorLinking', () => {
    it('should prepare output correctly with linked author ids provided where logged in author id not present', () => {
        const component = setup();
        const preparedOutput = component.instance().prepareOutput(
            { searchKey },
            {
                selectedAuthor: {
                    rek_author_id_id: null,
                    rek_author_id_pid: 'UQ:111111',
                    rek_author_id: 410,
                    rek_author_id_order: 6,
                },
            },
            linkedAuthorIdList,
        );

        expect(preparedOutput).toEqual([
            { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 1 },
            { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 2 },
            { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 3 },
            { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 4 },
            { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 5 },
            { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 410, rek_author_id_order: 6 },
            { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 7 },
            { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 123, rek_author_id_order: 8 },
            { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 9 },
        ]);
    });

    it('should prepare output correctly with empty linked author id list', () => {
        const component = setup();
        const preparedOutput = component.instance().prepareOutput(
            { searchKey },
            {
                selectedAuthor: {
                    rek_author_id_id: null,
                    rek_author_id_pid: 'UQ:111111',
                    rek_author_id: 410,
                    rek_author_id_order: 6,
                },
            },
            authorList.map(author => component.instance().transformToAuthorOrderId(0, author, searchKey)),
        );

        expect(preparedOutput).toEqual([
            { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 1 },
            { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 2 },
            { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 3 },
            { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 4 },
            { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 5 },
            { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 410, rek_author_id_order: 6 },
            { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 7 },
            { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 8 },
            { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 9 },
        ]);
    });

    it('should prepare output correctly with author order not start from 1', () => {
        const component = setup();
        const preparedOutput = component.instance().prepareOutput(
            { searchKey },
            {
                selectedAuthor: {
                    rek_author_id_id: null,
                    rek_author_id_pid: 'UQ:111111',
                    rek_author_id: 410,
                    rek_author_id_order: 3,
                },
            },
            [
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 2 },
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 3 },
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 4 },
            ],
        );

        expect(preparedOutput).toEqual([
            { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 2 },
            { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 410, rek_author_id_order: 3 },
            { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 4 },
        ]);
    });
});

// Contributors
const linkedContributorIdList = [
    {
        rek_contributor_id_id: null,
        rek_contributor_id_pid: 'UQ:111111',
        rek_contributor_id: 0,
        rek_contributor_id_order: 1,
    },
    {
        rek_contributor_id_id: null,
        rek_contributor_id_pid: 'UQ:111111',
        rek_contributor_id: 0,
        rek_contributor_id_order: 2,
    },
    {
        rek_contributor_id_id: null,
        rek_contributor_id_pid: 'UQ:111111',
        rek_contributor_id: 0,
        rek_contributor_id_order: 3,
    },
    {
        rek_contributor_id_id: null,
        rek_contributor_id_pid: 'UQ:111111',
        rek_contributor_id: 0,
        rek_contributor_id_order: 4,
    },
    {
        rek_contributor_id_id: null,
        rek_contributor_id_pid: 'UQ:111111',
        rek_contributor_id: 0,
        rek_contributor_id_order: 5,
    },
    {
        rek_contributor_id_id: null,
        rek_contributor_id_pid: 'UQ:111111',
        rek_contributor_id: 0,
        rek_contributor_id_order: 6,
    },
    {
        rek_contributor_id_id: null,
        rek_contributor_id_pid: 'UQ:111111',
        rek_contributor_id: 0,
        rek_contributor_id_order: 7,
    },
    {
        rek_contributor_id_id: null,
        rek_contributor_id_pid: 'UQ:111111',
        rek_contributor_id: 123,
        rek_contributor_id_order: 8,
    },
    {
        rek_contributor_id_id: null,
        rek_contributor_id_pid: 'UQ:111111',
        rek_contributor_id: 0,
        rek_contributor_id_order: 9,
    },
];
const contributorList = [
    {
        rek_contributor_id: null,
        rek_contributor_pid: 'UQ:111111',
        rek_author: 'Overgaard, Nana H.',
        rek_contributor_order: 1,
    },
    {
        rek_contributor_id: null,
        rek_contributor_pid: 'UQ:111111',
        rek_author: 'Cruz, Jazmina L.',
        rek_contributor_order: 2,
    },
    {
        rek_contributor_id: null,
        rek_contributor_pid: 'UQ:111111',
        rek_author: 'Bridge, Jennifer A.',
        rek_contributor_order: 3,
    },
    {
        rek_contributor_id: null,
        rek_contributor_pid: 'UQ:111111',
        rek_author: 'Nel, Hendrik J.',
        rek_contributor_order: 4,
    },
    {
        rek_contributor_id: null,
        rek_contributor_pid: 'UQ:111111',
        rek_author: 'Frazer, Ian H.',
        rek_contributor_order: 5,
    },
    {
        rek_contributor_id: null,
        rek_contributor_pid: 'UQ:111111',
        rek_author: 'La Gruta, Nicole L.',
        rek_contributor_order: 6,
    },
    {
        rek_contributor_id: null,
        rek_contributor_pid: 'UQ:111111',
        rek_author: 'Blumenthal, Antje',
        rek_contributor_order: 7,
    },
    {
        rek_contributor_id: null,
        rek_contributor_pid: 'UQ:111111',
        rek_author: 'Steptoe, Raymond J.',
        rek_contributor_order: 8,
    },
    {
        rek_contributor_id: null,
        rek_contributor_pid: 'UQ:111111',
        rek_author: 'Wells, James W.',
        rek_contributor_order: 9,
    },
];
const contributorSearchKey = { value: 'rek_contributor_id', order: 'rek_contributor_id_order', type: 'contributor' };

describe('ContributorLinking', () => {
    it(
        'should prepare output correctly with linked contributor ' +
            'ids provided where logged in author id not present',
        () => {
            const component = setup();
            const preparedOutput = component.instance().prepareOutput(
                { searchKey: contributorSearchKey },
                {
                    selectedAuthor: {
                        rek_contributor_id_id: null,
                        rek_contributor_id_pid: 'UQ:111111',
                        rek_contributor_id: 410,
                        rek_contributor_id_order: 6,
                    },
                },
                linkedContributorIdList,
            );

            expect(preparedOutput).toEqual([
                {
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: 'UQ:111111',
                    rek_contributor_id: 0,
                    rek_contributor_id_order: 1,
                },
                {
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: 'UQ:111111',
                    rek_contributor_id: 0,
                    rek_contributor_id_order: 2,
                },
                {
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: 'UQ:111111',
                    rek_contributor_id: 0,
                    rek_contributor_id_order: 3,
                },
                {
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: 'UQ:111111',
                    rek_contributor_id: 0,
                    rek_contributor_id_order: 4,
                },
                {
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: 'UQ:111111',
                    rek_contributor_id: 0,
                    rek_contributor_id_order: 5,
                },
                {
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: 'UQ:111111',
                    rek_contributor_id: 410,
                    rek_contributor_id_order: 6,
                },
                {
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: 'UQ:111111',
                    rek_contributor_id: 0,
                    rek_contributor_id_order: 7,
                },
                {
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: 'UQ:111111',
                    rek_contributor_id: 123,
                    rek_contributor_id_order: 8,
                },
                {
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: 'UQ:111111',
                    rek_contributor_id: 0,
                    rek_contributor_id_order: 9,
                },
            ]);
        },
    );

    it('should prepare output correctly with empty linked author id list', () => {
        const component = setup();
        const preparedOutput = component.instance().prepareOutput(
            { searchKey: contributorSearchKey },
            {
                selectedAuthor: {
                    rek_contributor_id_id: null,
                    rek_contributor_id_pid: 'UQ:111111',
                    rek_contributor_id: 410,
                    rek_contributor_id_order: 6,
                },
            },
            contributorList.map(author =>
                component.instance().transformToAuthorOrderId(0, author, contributorSearchKey),
            ),
        );

        expect(preparedOutput).toEqual([
            {
                rek_contributor_id_id: null,
                rek_contributor_id_pid: 'UQ:111111',
                rek_contributor_id: 0,
                rek_contributor_id_order: 1,
            },
            {
                rek_contributor_id_id: null,
                rek_contributor_id_pid: 'UQ:111111',
                rek_contributor_id: 0,
                rek_contributor_id_order: 2,
            },
            {
                rek_contributor_id_id: null,
                rek_contributor_id_pid: 'UQ:111111',
                rek_contributor_id: 0,
                rek_contributor_id_order: 3,
            },
            {
                rek_contributor_id_id: null,
                rek_contributor_id_pid: 'UQ:111111',
                rek_contributor_id: 0,
                rek_contributor_id_order: 4,
            },
            {
                rek_contributor_id_id: null,
                rek_contributor_id_pid: 'UQ:111111',
                rek_contributor_id: 0,
                rek_contributor_id_order: 5,
            },
            {
                rek_contributor_id_id: null,
                rek_contributor_id_pid: 'UQ:111111',
                rek_contributor_id: 410,
                rek_contributor_id_order: 6,
            },
            {
                rek_contributor_id_id: null,
                rek_contributor_id_pid: 'UQ:111111',
                rek_contributor_id: 0,
                rek_contributor_id_order: 7,
            },
            {
                rek_contributor_id_id: null,
                rek_contributor_id_pid: 'UQ:111111',
                rek_contributor_id: 0,
                rek_contributor_id_order: 8,
            },
            {
                rek_contributor_id_id: null,
                rek_contributor_id_pid: 'UQ:111111',
                rek_contributor_id: 0,
                rek_contributor_id_order: 9,
            },
        ]);
    });
});

describe('layout', () => {
    it('should handle basic props properly', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should handle missing props properly', () => {
        const testprops = {
            author: {},
            linkedAuthorIdList: [],
        };
        const wrapper = setup(testprops);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should handle empty params on rendering authors', () => {
        const testprops = {
            author: {},
            linkedAuthorIdList: [],
        };
        const wrapper = setup(testprops);
        wrapper.instance().getAuthorsToRender();
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().context.isMobile = true;
        expect(wrapper.instance().getAuthorsToRender([])).toEqual([]);
    });

    it('should handle missing search keys properly', () => {
        const testprops = {
            searchKey: {
                value: 'rek_author_id',
                order: 'rek_author_id_order',
            },
            authorList: authorList,
        };
        const wrapper = setup(testprops);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('shows extra small widths correctly (1 per row)', () => {
        const testprops = {
            width: 'xs',
            searchKey: {
                value: 'rek_author_id',
                order: 'rek_author_id_order',
                type: 'author',
            },
            authorList: authorList,
        };
        const wrapper = setup(testprops);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('shows small widths correctly (2 per row)', () => {
        const testprops = {
            width: 'sm',
            searchKey: {
                value: 'rek_author_id',
                order: 'rek_author_id_order',
                type: 'author',
            },
            authorList: authorList,
        };
        const wrapper = setup(testprops);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('shows normal widths correctly (3 per row)', () => {
        const testprops = {
            searchKey: {
                value: 'rek_author_id',
                order: 'rek_author_id_order',
                type: 'author',
            },
            authorList: authorList,
        };
        const wrapper = setup(testprops);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
