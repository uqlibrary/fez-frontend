import { DoiPreview } from './DoiPreview';
import { PUBLICATION_TYPE_RESEARCH_REPORT, DOCUMENT_TYPE_RESEARCH_REPORT } from 'config/general';

const setup = (testProps = {}, args = { isShallow: true }) => {
    const props = {
        author: {},
        publication: {},
        ...testProps,
    };

    return getElement(DoiPreview, props, args);
};

describe('DoiPreview', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toBe('');
    });

    it('should render a field', () => {
        const publication = {
            rek_display_type: PUBLICATION_TYPE_RESEARCH_REPORT,
            rek_display_type_lookup: DOCUMENT_TYPE_RESEARCH_REPORT,
            rek_title: 'Title',
            rek_pid: 'UQ:1234567',
            fez_record_search_key_doi: {
                rek_doi: 'test',
            },
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
        expect(wrapper.find('DoiField[field="rek-doi"]').props().heading).toBe('DOI (Existing)');
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
        expect(wrapper.find('DoiField[field="rek_title"]').props().heading).toBe('Title');
    });
});
