import { DoiPreview } from './DoiPreview';
import { PUBLICATION_TYPE_RESEARCH_REPORT, DOCUMENT_TYPE_RESEARCH_REPORT } from 'config/general';

const setup = (testProps = {}, args = { isShallow: true }) => {
    const props = {
        publication: {},
        ...testProps,
    };

    return getElement(DoiPreview, props, args);
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
        const wrapper = setup({});
        expect(toJson(wrapper)).toBe('');
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
        const wrapper = setup({ publication });
        expect(wrapper.find('DoiField[field="rek_title"]').props().data).toBe(publication.rek_title);
        expect(wrapper.find('DoiField[field="rek_doi"]').props().label).toBe('DOI (Existing)');
        expect(wrapper.find('DoiField[field="fez_record_search_key_author"]').props().data).toEqual([
            {
                aut_orcid_id: '10010101-101101',
                rek_author: 'test',
            },
        ]);
    });

    it('should revert to default headings when displaytype-specific headings are not found', () => {
        const publication = {
            rek_display_type: PUBLICATION_TYPE_RESEARCH_REPORT,
            rek_display_type_lookup: 'Something else',
            rek_title: 'Title',
            rek_pid: 'UQ:1234567',
            fez_record_search_key_author: [],
        };
        const wrapper = setup({ publication });
        expect(wrapper.find('DoiField[field="rek_title"]').props().label).toBe('Title');
    });

    it('should or should not display rek_parent_publication depending on whether start page is > 1', () => {
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
        const wrapper = setup({ publication });
        expect(wrapper.find('DoiField[field="fez_record_search_key_parent_publication"]')).toEqual({});

        const publication2 = {
            ...publication,
            fez_record_search_key_start_page: {
                rek_start_page: '1st',
            },
        };
        const wrapper2 = setup({ publication: publication2 });
        expect(wrapper2.find('DoiField[field="fez_record_search_key_parent_publication"]')).toEqual({});

        const publication3 = {
            ...publication,
            fez_record_search_key_start_page: {
                rek_start_page: '2',
            },
        };
        const wrapper3 = setup({ publication: publication3 });
        expect(wrapper3.find('DoiField[field="fez_record_search_key_parent_publication"]').props().data).toBe(
            publication3.fez_record_search_key_parent_publication,
        );
    });

    it('should not display series field in a Research Report when issn is missing or invalid', () => {
        const publication1 = {
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
        const wrapper1 = setup({ publication: publication1 });
        expect(wrapper1.find('DoiField[field="fez_record_search_key_series"]').props().data).toEqual({
            rek_series: 'something',
        });

        const publication2 = {
            ...publication1,
            fez_record_search_key_issn: [],
        };
        const wrapper2 = setup({ publication: publication2 });
        expect(wrapper2.find('DoiField[field="fez_record_search_key_series"]')).toEqual({});

        const publication3 = {
            ...publication1,
            fez_record_search_key_issn: [
                {
                    rek_issn: 'blah',
                },
            ],
        };
        const wrapper3 = setup({ publication: publication3 });
        expect(wrapper3.find('DoiField[field="fez_record_search_key_series"]')).toEqual({});
    });

    it('should not display issn field in a Research Report when rek_series is missing or empty', () => {
        const publication1 = {
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
        const wrapper1 = setup({ publication: publication1 });
        expect(wrapper1.find('DoiField[field="fez_record_search_key_issn"]').props().data).toEqual([
            {
                rek_issn: '1010-1011',
            },
        ]);

        const publication2 = {
            ...publication1,
            fez_record_search_key_series: null,
        };
        const wrapper2 = setup({ publication: publication2 });
        expect(wrapper2.find('DoiField[field="fez_record_search_key_issn"]')).toEqual({});

        const publication3 = {
            ...publication1,
            fez_record_search_key_series: '',
        };
        const wrapper3 = setup({ publication: publication3 });
        expect(wrapper3.find('DoiField[field="fez_record_search_key_issn"]')).toEqual({});
    });
});
