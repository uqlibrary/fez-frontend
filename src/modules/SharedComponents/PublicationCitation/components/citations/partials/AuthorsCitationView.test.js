import { AuthorsCitationView } from './AuthorsCitationView';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        classes: {},
        publication: testProps.publication || {}, // : PropTypes.object.isRequired,
        prefix: testProps.prefix,
        suffix: testProps.suffix,
        className: testProps.className || '',
        showLink: testProps.showLink || false,
        ...testProps,
    };
    return getElement(AuthorsCitationView, props, args);
}

describe('AuthorsCitationView test ', () => {
    it('should render component with no authors', () => {
        const wrapper = setup();
        expect(wrapper.find('.empty').length).toEqual(1);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should set class on component with no authors', () => {
        const wrapper = setup({ className: 'myClass' });
        expect(wrapper.find('.myClass.empty').length).toEqual(1);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with 1 author', () => {
        const testObject = {
            fez_record_search_key_author: [
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Pedroso, Marcelo Monteiro',
                    rek_author_order: 1,
                },
            ],
        };
        const wrapper = setup({ publication: testObject });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with 2 authors', () => {
        const testObject = {
            fez_record_search_key_author: [
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Pedroso, Marcelo Monteiro',
                    rek_author_order: 1,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Smith, J',
                    rek_author_order: 2,
                },
            ],
        };
        const wrapper = setup({ publication: testObject });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with 2 authors for publication view page', () => {
        const testObject = {
            fez_record_search_key_author: [
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Pedroso, Marcelo Monteiro',
                    rek_author_order: 1,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Smith, J',
                    rek_author_order: 2,
                },
            ],
            fez_record_search_key_author_id: [
                {
                    rek_author_id_id: null,
                    rek_author_id: 1,
                    rek_author_id_order: 1,
                },
                {
                    rek_author_id_id: null,
                    rek_author_id: 2,
                    rek_author_id_order: 2,
                },
            ],
        };
        const wrapper = setup({ publication: testObject, showLink: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with 2 authors for publication view page if author ids not supplied', () => {
        const testObject = {
            fez_record_search_key_author: [
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Pedroso, Marcelo Monteiro',
                    rek_author_order: 1,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Smith, J',
                    rek_author_order: 2,
                },
            ],
        };
        const wrapper = setup({ publication: testObject, showLink: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with 3 authors for publication view page', () => {
        const testObject = {
            fez_record_search_key_author: [
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Pedroso, Marcelo Monteiro',
                    rek_author_order: 1,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Smith, J',
                    rek_author_order: 2,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Smith, J',
                    rek_author_order: 3,
                },
            ],
            fez_record_search_key_author_id: [
                {
                    rek_author_id_id: null,
                    rek_author_id: 1,
                    rek_author_id_order: 1,
                },
                {
                    rek_author_id_id: null,
                    rek_author_id: 2,
                    rek_author_id_order: 2,
                },
                {
                    rek_author_id_id: null,
                    rek_author_id: 3,
                    rek_author_id_order: 3,
                },
            ],
        };
        const wrapper = setup({ publication: testObject, showLink: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with 3 authors', () => {
        const testObject = {
            fez_record_search_key_author: [
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Pedroso, Marcelo Monteiro',
                    rek_author_order: 1,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Smith, J',
                    rek_author_order: 2,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J',
                    rek_author_order: 3,
                },
            ],
        };
        const wrapper = setup({ publication: testObject });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with 3 authors with prefix/suffix', () => {
        const testObject = {
            fez_record_search_key_author: [
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Pedroso, Marcelo Monteiro',
                    rek_author_order: 1,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Smith, J',
                    rek_author_order: 2,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J',
                    rek_author_order: 3,
                },
            ],
        };
        const wrapper = setup({ publication: testObject, prefix: 'Authored by: ', suffix: ' people.' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with 10 authors and show more link', () => {
        const testObject = {
            fez_record_search_key_author: [
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Pedroso, Marcelo Monteiro',
                    rek_author_order: 1,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Smith, J',
                    rek_author_order: 2,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J',
                    rek_author_order: 3,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J A',
                    rek_author_order: 4,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J B',
                    rek_author_order: 5,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J C',
                    rek_author_order: 6,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J D',
                    rek_author_order: 7,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J E',
                    rek_author_order: 8,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J F',
                    rek_author_order: 9,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J G',
                    rek_author_order: 10,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J H',
                    rek_author_order: 11,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J J',
                    rek_author_order: 12,
                },
            ],
        };
        const wrapper = setup(
            {
                publication: testObject,
                prefix: 'Authored by: ',
                suffix: ' people.',
            },
            { isShallow: true },
        );
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.state().authors.length).toEqual(12);
        expect(wrapper.find('.citationAuthor').length).toEqual(12);
    });

    it('should not fail with missing data', () => {
        const wrapper = setup({ publication: null, prefix: 'Authored by: ', suffix: ' people.' }, true);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.state().authors.length).toEqual(0);
        expect(wrapper.find('.citationAuthor').length).toEqual(0);
    });

    it('should render component with exactly 10 authors', () => {
        const testObject = {
            fez_record_search_key_author: [
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Pedroso, Marcelo Monteiro',
                    rek_author_order: 1,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Smith, J',
                    rek_author_order: 2,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J',
                    rek_author_order: 3,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J A',
                    rek_author_order: 4,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J B',
                    rek_author_order: 5,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J C',
                    rek_author_order: 6,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J D',
                    rek_author_order: 7,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J E',
                    rek_author_order: 8,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J F',
                    rek_author_order: 9,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J G',
                    rek_author_order: 10,
                },
            ],
        };
        const wrapper = setup({ publication: testObject, prefix: 'Authored by: ', suffix: ' people.' }, true);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.state().authors.length).toEqual(10);
        expect(wrapper.find('.citationAuthor').length).toEqual(10);
    });

    it('should render a list with ellipsis when elasticsearch cant supply all authors', () => {
        const testObject = {
            fez_record_search_key_author: [
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Pedroso, Marcelo Monteiro',
                    rek_author_order: 1,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Smith, J',
                    rek_author_order: 2,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J',
                    rek_author_order: 3,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J A',
                    rek_author_order: 4,
                },
            ],
            fez_record_search_key_author_id: [
                {
                    rek_author_id_id: null,
                    rek_author_pid_id: 'UQ:678742',
                    rek_author_id: 7654,
                    rek_author_order_id: 1,
                },
                {
                    rek_author_id_id: null,
                    rek_author_pid_id: 'UQ:678742',
                    rek_author_id: 23235,
                    rek_author_order_id: 2,
                },
                {
                    rek_author_id_id: null,
                    rek_author_pid_id: 'UQ:678742',
                    rek_author_id: 78678,
                    rek_author_order_id: 3,
                },
                {
                    rek_author_id_id: null,
                    rek_author_pid_id: 'UQ:678742',
                    rek_author_id: 76845,
                    rek_author_order_id: 4,
                },
                {
                    rek_author_id_id: null,
                    rek_author_pid_id: 'UQ:678742',
                    rek_author_id: 6856346,
                    rek_author_order_id: 5,
                },
                {
                    rek_author_id_id: null,
                    rek_author_pid_id: 'UQ:678742',
                    rek_author_id: 1234,
                    rek_author_order_id: 6,
                },
                {
                    rek_author_id_id: null,
                    rek_author_pid_id: 'UQ:678742',
                    rek_author_id: 342546,
                    rek_author_order_id: 7,
                },
                {
                    rek_author_id_id: null,
                    rek_author_pid_id: 'UQ:678742',
                    rek_author_id: 87765,
                    rek_author_order_id: 8,
                },
            ],
        };
        const wrapper = setup(
            {
                publication: testObject,
                maxAuthorDisplayNumber: 3,
                citationStyle: 'list',
            },
            { isShallow: true },
        );
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.state().authors.length).toEqual(4);
        expect(wrapper.find('.citationAuthor').length).toEqual(3);
    });

    it('should render a header correctly when too many authors are provided', () => {
        const testObject = {
            fez_record_search_key_author: [
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Pedroso, Marcelo Monteiro',
                    rek_author_order: 1,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Smith, J',
                    rek_author_order: 2,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J',
                    rek_author_order: 3,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J A',
                    rek_author_order: 4,
                },
            ],
            fez_record_search_key_author_id: [
                {
                    rek_author_id_id: null,
                    rek_author_pid_id: 'UQ:678742',
                    rek_author_id: 7654,
                    rek_author_order_id: 1,
                },
                {
                    rek_author_id_id: null,
                    rek_author_pid_id: 'UQ:678742',
                    rek_author_id: 23235,
                    rek_author_order_id: 2,
                },
                {
                    rek_author_id_id: null,
                    rek_author_pid_id: 'UQ:678742',
                    rek_author_id: 78678,
                    rek_author_order_id: 3,
                },
                {
                    rek_author_id_id: null,
                    rek_author_pid_id: 'UQ:678742',
                    rek_author_id: 76845,
                    rek_author_order_id: 4,
                },
                {
                    rek_author_id_id: null,
                    rek_author_pid_id: 'UQ:678742',
                    rek_author_id: 6856346,
                    rek_author_order_id: 5,
                },
                {
                    rek_author_id_id: null,
                    rek_author_pid_id: 'UQ:678742',
                    rek_author_id: 1234,
                    rek_author_order_id: 6,
                },
                {
                    rek_author_id_id: null,
                    rek_author_pid_id: 'UQ:678742',
                    rek_author_id: 342546,
                    rek_author_order_id: 7,
                },
                {
                    rek_author_id_id: null,
                    rek_author_pid_id: 'UQ:678742',
                    rek_author_id: 87765,
                    rek_author_order_id: 8,
                },
            ],
        };
        const wrapper = setup(
            {
                publication: testObject,
                maxAuthorDisplayNumber: 2,
                citationStyle: 'header',
            },
            { isShallow: true },
        );
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.state().authors.length).toEqual(4);
        expect(wrapper.find('.citationAuthor').length).toEqual(3);
    });

    it('should render a header correctly when all authors are provided', () => {
        const testObject = {
            fez_record_search_key_author: [
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Pedroso, Marcelo Monteiro',
                    rek_author_order: 1,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Smith, J',
                    rek_author_order: 2,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J',
                    rek_author_order: 3,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J A',
                    rek_author_order: 4,
                },
            ],
            fez_record_search_key_author_id: [
                {
                    rek_author_id_id: null,
                    rek_author_pid_id: 'UQ:678742',
                    rek_author_id: 7654,
                    rek_author_order_id: 1,
                },
                {
                    rek_author_id_id: null,
                    rek_author_pid_id: 'UQ:678742',
                    rek_author_id: 23235,
                    rek_author_order_id: 2,
                },
                {
                    rek_author_id_id: null,
                    rek_author_pid_id: 'UQ:678742',
                    rek_author_id: 78678,
                    rek_author_order_id: 3,
                },
                {
                    rek_author_id_id: null,
                    rek_author_pid_id: 'UQ:678742',
                    rek_author_id: 76845,
                    rek_author_order_id: 4,
                },
            ],
        };
        const wrapper = setup(
            {
                publication: testObject,
                citationStyle: 'header',
            },
            { isShallow: true },
        );
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.state().authors.length).toEqual(4);
        expect(wrapper.find('.citationAuthor').length).toEqual(4);
    });

    it('should render component with 3 authors with prefix/suffix without changing original data structure', () => {
        const testObject = {
            fez_record_search_key_author: [
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Pedroso, Marcelo Monteiro',
                    rek_author_order: 3,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Smith, J',
                    rek_author_order: 1,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J',
                    rek_author_order: 2,
                },
            ],
        };

        const wrapper = setup({ publication: testObject, prefix: 'Authored by: ', suffix: ' people.' });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(testObject).toEqual({
            fez_record_search_key_author: [
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Pedroso, Marcelo Monteiro',
                    rek_author_order: 3,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Smith, J',
                    rek_author_order: 1,
                },
                {
                    rek_author_id: null,
                    rek_author_pid: 'UQ:678742',
                    rek_author: 'Andersen, J',
                    rek_author_order: 2,
                },
            ],
        });
    });
});
