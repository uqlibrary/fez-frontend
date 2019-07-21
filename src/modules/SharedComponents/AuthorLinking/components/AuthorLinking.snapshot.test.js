import AuthorLinking from './AuthorLinking';

const contributorProps = {
    searchKey: { value: 'rek_contributor_id', order: 'rek_contributor_id_order', type: 'contributor' },
    loggedInAuthor: { aut_id: 410 },
    authorList: [
        {
            rek_contributor_id: null,
            rek_contributor_pid: 'UQ:654776',
            rek_contributor: 'Overgaard, Nana H.',
            rek_contributor_order: 1,
        },
        {
            rek_contributor_id: null,
            rek_contributor_pid: 'UQ:654776',
            rek_contributor: 'Cruz, Jazmina L.',
            rek_contributor_order: 2,
        },
        {
            rek_contributor_id: null,
            rek_contributor_pid: 'UQ:654776',
            rek_contributor: 'Bridge, Jennifer A.',
            rek_contributor_order: 3,
        },
        {
            rek_contributor_id: null,
            rek_contributor_pid: 'UQ:654776',
            rek_contributor: 'Nel, Hendrik J.',
            rek_contributor_order: 4,
        },
    ],
    linkedAuthorIdList: [],
    disabled: false,
};
const authorProps = {
    searchKey: { value: 'rek_author_id', order: 'rek_author_id_order', type: 'author' },
    loggedInAuthor: { aut_id: 410 },
    authorList: [
        {
            rek_author_id: null,
            rek_author_pid: 'UQ:654776',
            rek_author: 'Overgaard, Nana H.',
            rek_author_order: 1,
        },
        {
            rek_author_id: null,
            rek_author_pid: 'UQ:654776',
            rek_author: 'Cruz, Jazmina L.',
            rek_author_order: 2,
        },
        {
            rek_author_id: null,
            rek_author_pid: 'UQ:654776',
            rek_author: 'Bridge, Jennifer A.',
            rek_author_order: 3,
        },
        {
            rek_author_id: null,
            rek_author_pid: 'UQ:654776',
            rek_author: 'Nel, Hendrik J.',
            rek_author_order: 4,
        },
        {
            rek_author_id: null,
            rek_author_pid: 'UQ:654776',
            rek_author: 'Frazer, Ian H.',
            rek_author_order: 5,
        },
        {
            rek_author_id: null,
            rek_author_pid: 'UQ:654776',
            rek_author: 'La Gruta, Nicole L.',
            rek_author_order: 6,
        },
        {
            rek_author_id: null,
            rek_author_pid: 'UQ:654776',
            rek_author: 'Blumenthal, Antje',
            rek_author_order: 7,
        },
        {
            rek_author_id: null,
            rek_author_pid: 'UQ:654776',
            rek_author: 'Steptoe, Raymond J.',
            rek_author_order: 8,
        },
        {
            rek_author_id: null,
            rek_author_pid: 'UQ:654776',
            rek_author: 'Wells, James W.',
            rek_author_order: 9,
        },
    ],
    linkedAuthorIdList: [],
    disabled: false,
};

function setup(testProps = {}) {
    const props = {
        loggedInAuthor: testProps.author || { aut_id: 410 },
        linkedAuthorIdList: testProps.linkedAuthorIdList || null,
        disabled: testProps.disabled || false,
        authorList: testProps.authorList || [],
        ...testProps,
    };
    return getElement(AuthorLinking, props);
}

describe('AuthorLinking', () => {
    it('should render all authors as unlinked and selectable', () => {
        const wrapper = setup({ ...authorProps });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render author Bridge as linked', () => {
        const wrapper = setup({
            ...authorProps,
            linkedAuthorIdList: [
                { rek_author_id: 0, rek_author_id_order: 1 },
                { rek_author_id: 0, rek_author_id_order: 2 },
                { rek_author_id: 123, rek_author_id_order: 3 },
                { rek_author_id: 0, rek_author_id_order: 4 },
                { rek_author_id: 0, rek_author_id_order: 5 },
                { rek_author_id: 0, rek_author_id_order: 6 },
                { rek_author_id: 0, rek_author_id_order: 7 },
                { rek_author_id: 0, rek_author_id_order: 8 },
                { rek_author_id: 0, rek_author_id_order: 9 },
            ],
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should be disabled', () => {
        const wrapper = setup({ ...authorProps, disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render authors correctly', () => {
        const wrapper = setup({
            ...authorProps,
            authorList: [
                {
                    rek_author_id: 30445289,
                    rek_author_pid: 'UQ:795480',
                    rek_author_xsdmf_id: null,
                    rek_author: 'J Smith',
                    rek_author_order: 1,
                },
                {
                    rek_author_id: 30445290,
                    rek_author_pid: 'UQ:795480',
                    rek_author_xsdmf_id: null,
                    rek_author: 'A Smith',
                    rek_author_order: 2,
                },
            ],
            linkedAuthorIdList: [
                {
                    rek_author_id_id: 29723144,
                    rek_author_id_pid: 'UQ:795480',
                    rek_author_id_xsdmf_id: null,
                    rek_author_id: 1671,
                    rek_author_id_order: 1,
                    rek_author_id_lookup: 'Brown, Melissa Anne',
                },
                {
                    rek_author_id_id: 29723145,
                    rek_author_id_pid: 'UQ:795480',
                    rek_author_id_xsdmf_id: null,
                    rek_author_id: null,
                    rek_author_id_order: 2,
                },
            ],
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('ContributorLinking', () => {
    it('should render all contributors as unlinked and selectable', () => {
        const wrapper = setup({ ...contributorProps });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render author Bridge as linked', () => {
        const wrapper = setup({
            ...contributorProps,
            linkedAuthorIdList: [
                { rek_contributor_id: 0, rek_contributor_id_order: 1 },
                { rek_contributor_id: 0, rek_contributor_id_order: 2 },
                { rek_contributor_id: 123, rek_contributor_id_order: 3 },
                { rek_contributor_id: 0, rek_contributor_id_order: 4 },
                { rek_contributor_id: 0, rek_contributor_id_order: 5 },
                { rek_contributor_id: 0, rek_contributor_id_order: 6 },
                { rek_contributor_id: 0, rek_contributor_id_order: 7 },
                { rek_contributor_id: 0, rek_contributor_id_order: 8 },
                { rek_contributor_id: 0, rek_contributor_id_order: 9 },
            ],
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should be disabled', () => {
        const wrapper = setup({ ...contributorProps, disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
