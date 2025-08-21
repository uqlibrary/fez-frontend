import React from 'react';
jest.dontMock('./CitationCounts');
import CitationCounts from './CitationCounts';
import { myRecordsList } from 'mock/data';
import { render, WithRouter } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        publication: testProps.publication || {},
        ...testProps,
    };
    return render(
        <WithRouter>
            <CitationCounts {...props} />
        </WithRouter>,
    );
}

describe('CitationCounts', () => {
    it('should render component with no metrics', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render component with a mock record metrics', () => {
        const { container } = setup({
            publication: {
                ...myRecordsList.data[0],
                fez_record_search_key_oa_embargo_days: {
                    rek_oa_embargo_days: 0,
                },
                rek_created_date: '2019-12-25T00:00:00Z',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render component with all metrics', () => {
        const publication = {
            fez_record_search_key_oa_embargo_days: {
                rek_oa_embargo_days: 0,
            },
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            rek_title: 'This is test title',
            rek_dimensions_citation_count: 33,
            rek_thomson_citation_count: 0,
            rek_scopus_citation_count: 1,
            rek_openalex_citation_count: 1,
            rek_gs_citation_count: 1,
            rek_altmetric_score: 1,
            fez_record_search_key_dimensions_id: {
                rek_dimensions_id: 12345,
            },
            fez_record_search_key_oa_status: {
                rek_oa_status: 453693,
            },
            fez_record_search_key_isi_loc: {
                rek_isi_loc: 12345,
            },
            fez_record_search_key_scopus_id: {
                rek_scopus_id: 12345,
            },
            fez_record_search_key_openalex_id: {
                rek_openalex_id: 12345,
            },
            rek_altmetric_id: 12345,
        };
        const { container } = setup({ publication });
        expect(container).toMatchSnapshot();
    });

    it('should render null as 0', () => {
        const publication = {
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            rek_title: 'This is test title',
            rek_dimensions_citation_count: null,
            fez_record_search_key_dimensions_id: {
                rek_dimensions_id: 12345,
            },
        };
        const { container } = setup({ publication });
        expect(container).toMatchSnapshot();
    });

    it('should not render View full statistics link on public pages for anonymous user', () => {
        const publication = {
            fez_record_search_key_oa_embargo_days: {
                rek_oa_embargo_days: 0,
            },
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            rek_title: 'This is test title',
            rek_thomson_citation_count: 1,
            rek_scopus_citation_count: 0,
            rek_gs_citation_count: 1,
            rek_altmetric_score: 1,
            fez_record_search_key_oa_status: {
                rek_oa_status: 453693,
            },
            fez_record_search_key_isi_loc: {
                rek_isi_loc: 12345,
            },
            fez_record_search_key_scopus_id: {
                rek_scopus_id: 12345,
            },
            rek_altmetric_id: 12345,
        };
        const { container } = setup({ publication, hideViewFullStatisticsLink: true });
        expect(container).toMatchSnapshot();
    });

    it('should render open access icon when required', () => {
        const { container } = setup({
            publication: {
                ...myRecordsList.data[0],
                calculateOpenAccess: () => true,
            },
        });

        expect(container).toMatchSnapshot();
    });
});
