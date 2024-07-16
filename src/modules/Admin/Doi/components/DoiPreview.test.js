import React from 'react';
import { DoiPreview } from './DoiPreview';
import { PUBLICATION_TYPE_RESEARCH_REPORT, DOCUMENT_TYPE_RESEARCH_REPORT } from 'config/general';
import { render, WithRouter } from 'test-utils';

const setup = (testProps = {}) => {
    const props = {
        publication: {},
        ...testProps,
    };

    return render(
        <WithRouter>
            <DoiPreview {...props} />
        </WithRouter>,
    );
};

const testPublication = {
    rek_display_type: PUBLICATION_TYPE_RESEARCH_REPORT,
    rek_display_type_lookup: DOCUMENT_TYPE_RESEARCH_REPORT,
    rek_title: 'Title',
    rek_pid: 'UQ:1234567',
    fez_record_search_key_doi: {
        rek_doi: 'test',
    },
};

describe('DoiPreview', () => {
    it('should render default view', () => {
        const { container } = setup({});
        expect(container).toHaveTextContent('');
    });

    it('should render a field', () => {
        const publication = {
            ...testPublication,
            fez_record_search_key_author: [
                {
                    rek_author: 'test',
                },
            ],
            fez_record_search_key_author_id: [
                {
                    author: {
                        aut_orcid_id: '10010101-101101',
                    },
                },
            ],
        };
        const { getByTestId } = setup({ publication });
        expect(getByTestId('rek-title')).toHaveTextContent(publication.rek_title);
        expect(getByTestId('rek-doi-label')).toHaveTextContent('DOI (Existing)');
        expect(getByTestId('rek-author-0')).toHaveTextContent('test');
        expect(getByTestId('rek-author-0-orcid-link-link')).toHaveTextContent('10010101-101101');
    });

    it('should revert to default headings when displaytype-specific headings are not found', () => {
        const publication = {
            rek_display_type: PUBLICATION_TYPE_RESEARCH_REPORT,
            rek_display_type_lookup: 'Something else',
            rek_title: 'Title',
            rek_pid: 'UQ:1234567',
            fez_record_search_key_author: [],
        };
        const { getByTestId } = setup({ publication });
        expect(getByTestId('rek-title')).toHaveTextContent(publication.rek_title);
    });

    it('should display rek_parent_publication when start page is > 1', () => {
        const publication = {
            ...testPublication,
            fez_record_search_key_author: [
                {
                    rek_author: 'test',
                },
            ],
            fez_record_search_key_author_id: [],
            fez_record_search_key_parent_publication: {
                rek_parent_publication: 'Test publication',
            },
            fez_record_search_key_start_page: {
                rek_start_page: '2',
            },
        };
        const { queryByTestId } = setup({ publication });
        expect(queryByTestId('rek-parent-publication')).toBeInTheDocument();
    });

    it('should not display rek_parent_publication when start page is 1st', () => {
        const publication = {
            ...testPublication,
            fez_record_search_key_author: [
                {
                    rek_author: 'test',
                },
            ],
            fez_record_search_key_author_id: [],
            fez_record_search_key_parent_publication: {
                rek_parent_publication: 'Test publication',
            },
            fez_record_search_key_start_page: {
                rek_start_page: '1st',
            },
        };
        const { queryByTestId } = setup({ publication });
        expect(queryByTestId('rek-parent-publication')).not.toBeInTheDocument();
    });

    it('should not display rek_parent_publication when start page is 1', () => {
        const publication = {
            ...testPublication,
            fez_record_search_key_author: [
                {
                    rek_author: 'test',
                },
            ],
            fez_record_search_key_author_id: [],
            fez_record_search_key_parent_publication: {
                rek_parent_publication: 'Test publication',
            },
            fez_record_search_key_start_page: {
                rek_start_page: '1',
            },
        };
        const { queryByTestId } = setup({ publication });
        expect(queryByTestId('rek-parent-publication')).not.toBeInTheDocument();
    });

    it('should display series field in a Research Report when issn valid', () => {
        const publication = {
            ...testPublication,
            fez_record_search_key_series: {
                rek_series: 'something',
            },
            fez_record_search_key_issn: [
                {
                    rek_issn: '1010-1011',
                },
            ],
        };
        const { getByTestId } = setup({ publication });
        expect(getByTestId('rek-series')).toHaveTextContent('something');
    });

    it('should not display series field in a Research Report when issn is missing', () => {
        const publication = {
            ...testPublication,
            fez_record_search_key_series: {
                rek_series: 'something',
            },
            fez_record_search_key_issn: [],
        };
        const { queryByTestId } = setup({ publication });
        expect(queryByTestId('rek-series')).not.toBeInTheDocument();
    });

    it('should not display series field in a Research Report when issn is invalid', () => {
        const publication = {
            ...testPublication,
            fez_record_search_key_series: {
                rek_series: 'something',
            },
            fez_record_search_key_issn: [
                {
                    rek_issn: 'blah',
                },
            ],
        };
        const { queryByTestId } = setup({ publication });
        expect(queryByTestId('rek-series')).not.toBeInTheDocument();
    });

    it('should display issn field in a Research Report when rek_series exists', () => {
        const publication = {
            ...testPublication,
            fez_record_search_key_series: {
                rek_series: 'something',
            },
            fez_record_search_key_issn: [
                {
                    rek_issn: '1010-1011',
                },
            ],
        };
        const { queryByTestId } = setup({ publication });
        expect(queryByTestId('rek-issn')).toHaveTextContent('1010-1011');
    });

    it('should not display issn field in a Research Report when rek_series is empty', () => {
        const publication = {
            ...testPublication,
            fez_record_search_key_series: null,
            fez_record_search_key_issn: [
                {
                    rek_issn: '1010-1011',
                },
            ],
        };
        const { queryByTestId } = setup({ publication });
        expect(queryByTestId('rek-issn')).not.toBeInTheDocument();
    });

    it('should not display issn field in a Research Report when rek_series is empty', () => {
        const publication = {
            ...testPublication,
            fez_record_search_key_series: '',
            fez_record_search_key_issn: [
                {
                    rek_issn: '1010-1011',
                },
            ],
        };
        const { queryByTestId } = setup({ publication });
        expect(queryByTestId('rek-issn')).not.toBeInTheDocument();
    });
});
