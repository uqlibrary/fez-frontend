import React from 'react';
import { AuthorsCitationView } from './AuthorsCitationView';
import { pathConfig } from 'config/pathConfig';
import { rtlRender, WithRouter } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        classes: {},
        publication: testProps.publication || {}, // : PropTypes.object.isRequired,
        prefix: testProps.prefix,
        suffix: testProps.suffix,
        className: testProps.className || '',
        showLink: testProps.showLink || false,
        ...testProps,
    };
    return rtlRender(
        <WithRouter>
            <AuthorsCitationView {...props} />
        </WithRouter>,
    );
}

describe('AuthorsCitationView', () => {
    it('should render component with no authors', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should set class on component with no authors', () => {
        const { container } = setup({ className: 'myClass' });
        expect(container).toMatchSnapshot();
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
        const { container } = setup({ publication: testObject });
        expect(container).toMatchSnapshot();
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
        const { container } = setup({ publication: testObject });
        expect(container).toMatchSnapshot();
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
        const { container } = setup({ publication: testObject, showLink: true });
        expect(container).toMatchSnapshot();
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
        const { container } = setup({ publication: testObject, showLink: true });
        expect(container).toMatchSnapshot();
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
        const { container } = setup({ publication: testObject, showLink: true });
        expect(container).toMatchSnapshot();
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
        const { container } = setup({ publication: testObject });
        expect(container).toMatchSnapshot();
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
        const { container } = setup({ publication: testObject, prefix: 'Authored by: ', suffix: ' people.' });
        expect(container).toMatchSnapshot();
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
        const { container } = setup({
            publication: testObject,
            prefix: 'Authored by: ',
            suffix: ' people.',
        });
        expect(container).toMatchSnapshot();
    });

    it('should not fail with missing data', () => {
        const { container } = setup({ prefix: 'Authored by: ', suffix: ' people.' });
        expect(container).toMatchSnapshot();
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
        const { container } = setup({ publication: testObject, prefix: 'Authored by: ', suffix: ' people.' });
        expect(container).toMatchSnapshot();
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
        const { container } = setup({
            publication: testObject,
            maxAuthorDisplayNumber: 3,
            citationStyle: 'list',
        });
        expect(container).toMatchSnapshot();
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
        const { container } = setup({
            publication: testObject,
            maxAuthorDisplayNumber: 2,
            citationStyle: 'header',
        });
        expect(container).toMatchSnapshot();
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
        const { container } = setup({
            publication: testObject,
            citationStyle: 'header',
        });
        expect(container).toMatchSnapshot();
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

        const { container } = setup({ publication: testObject, prefix: 'Authored by: ', suffix: ' people.' });
        expect(container).toMatchSnapshot();
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

    it('should render component with link containing contributor id', () => {
        const testObject = {
            fez_record_search_key_contributor: [
                {
                    rek_contributor_id: 3234727,
                    rek_contributor_pid: 'UQ:07ee065',
                    rek_contributor_xsdmf_id: null,
                    rek_contributor: 'Fitzgerald, Lisa',
                    rek_contributor_order: 2,
                },
            ],
            fez_record_search_key_contributor_id: [
                {
                    rek_contributor_id_id: 2406373,
                    rek_contributor_id_pid: 'UQ:07ee065',
                    rek_contributor_id_xsdmf_id: null,
                    rek_contributor_id: 74066,
                    rek_contributor_id_order: 2,
                    rek_contributor_id_lookup: 'Fitzgerald, Lisa J.',
                },
            ],
        };
        const { getByRole, container } = setup({
            publication: testObject,
            getLink: pathConfig.list.contributor,
            searchKey: {
                key: 'fez_record_search_key_contributor',
                subkey: 'rek_contributor',
                order: 'rek_contributor_order',
            },
            idSearchKey: {
                idKey: 'fez_record_search_key_contributor_id',
                idSubkey: 'rek_contributor_id',
                idOrder: 'rek_contributor_id_order',
            },
            showLink: true,
        });
        expect(container).toMatchSnapshot();

        expect(getByRole('link', { name: 'Fitzgerald, Lisa' })).toBeInTheDocument(); // ('rek-contributor-0-link')).toBeInTheDocument();
        expect(getByRole('link', { name: 'Fitzgerald, Lisa' }).href).toContain(
            'rek_contributor_id%5D%5Blabel%5D=74066+(Fitzgerald%2C+Lisa)',
        );
    });
});
