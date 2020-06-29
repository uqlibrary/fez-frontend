import { AuthorLinking } from './AuthorLinking';

function setup(testProps) {
    const props = {
        classes: {
            infiniteContainer: 'infiniteContainer',
        },
        ...testProps,
    };

    return getElement(AuthorLinking, props);
}

describe('AuthorLinking', () => {
    const searchKey = { value: 'rek_author_id', order: 'rek_author_id_order', type: 'author' };

    it('should call componentDidMount life cycle method', () => {
        const props = {
            searchKey: searchKey,
            authorList: [
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:111111',
                    rek_author: 'Overgaard, Nana H.',
                    rek_author_order: 1,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:111111',
                    rek_author: 'Cruz, Jazmina L.',
                    rek_author_order: 2,
                },
            ],
            linkedAuthorIdList: [
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 1 },
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 2 },
            ],
        };

        const wrapper = setup(props);
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should call componentDidMount life cycle method with authorList only', () => {
        const props = {
            searchKey: searchKey,
            authorList: [
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:111111',
                    rek_author: 'Overgaard, Nana H.',
                    rek_author_order: 1,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:111111',
                    rek_author: 'Cruz, Jazmina L.',
                    rek_author_order: 2,
                },
            ],
        };

        const wrapper = setup(props);
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should call UNSAFE_componentWillUpdate life cycle method on author selected', () => {
        const onChange = jest.fn();
        const props = {
            searchKey: searchKey,
            loggedInAuthor: { aut_id: 111 },
            authorList: [
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:111111',
                    rek_author: 'Overgaard, Nana H.',
                    rek_author_order: 1,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:111111',
                    rek_author: 'Cruz, Jazmina L.',
                    rek_author_order: 2,
                },
            ],
            onChange: onChange,
        };

        const wrapper = setup(props);
        wrapper.instance()._selectAuthor({
            rek_author_id: null,
            rek_author_pid: 'UQ:111111',
            rek_author: 'Overgaard, Nana H.',
            rek_author_order: 1,
        });
        expect(onChange).toHaveBeenCalled();

        wrapper.instance()._acceptAuthorLinkingTermsAndConditions();
        expect(onChange).toHaveBeenCalled();
    });

    it('should render component if authorList has more authors than linkedAuthorIdList', () => {
        const props = {
            searchKey: searchKey,
            authorList: [
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:111111',
                    rek_author: 'Overgaard, Nana H.',
                    rek_author_order: 1,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:111111',
                    rek_author: 'Cruz, Jazmina L.',
                    rek_author_order: 2,
                },
            ],
            linkedAuthorIdList: [
                { rek_author_id_id: null, rek_author_id_pid: 'UQ:111111', rek_author_id: 0, rek_author_id_order: 1 },
            ],
        };

        const wrapper = setup(props);
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should maintain question if onchange prop is missing', () => {
        const props = {
            searchKey: searchKey,
            loggedInAuthor: { aut_id: 111 },
            authorList: [
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:111111',
                    rek_author: 'Overgaard, Nana H.',
                    rek_author_order: 1,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:111111',
                    rek_author: 'Cruz, Jazmina L.',
                    rek_author_order: 2,
                },
            ],
            onChange: null,
        };

        const wrapper = setup(props);
        expect(toJson(wrapper)).toMatchSnapshot();

        const author = null;
        wrapper.instance()._selectAuthor(author);
        wrapper.update();

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
