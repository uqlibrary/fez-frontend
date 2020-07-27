import { journalArticle } from 'mock/data/testing/records';
// import { GrantInformationClass } from './GrantInformation';
import GrantInformation from './GrantInformation';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        publication: journalArticle,
        history: { push: jest.fn() },
        actions: testProps.actions,
        classes: {},
        ...testProps,
    };
    return getElement(GrantInformation, props, args);
}

describe('Grant Information Component ', () => {
    it('should render component', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('#grantInformation').length).toEqual(1);
    });

    it('should render component mounted', () => {
        const wrapper = getElement(
            GrantInformation,
            {
                publication: journalArticle,
                history: { push: jest.fn() },
                actions: {},
                classes: {},
            },
            { isShallow: false },
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render component with empty publication', () => {
        const wrapper = setup({ publication: {} });
        expect(toJson(wrapper)).toBe('');
    });

    it('should render with publication without grant id data', () => {
        const publication = Object.assign({}, journalArticle);
        delete publication.fez_record_search_key_grant_id;
        const wrapper = setup({ publication: publication });

        const grantRow = wrapper
            .find('GrantDetails')
            .first()
            .shallow();

        expect(grantRow.find('[data-testid="rek-grant-label-0"]').text()).toBe('Grant agency');
        expect(grantRow.find('[data-testid="rek-grant-text-0"]').text()).toBe(
            publication.fez_record_search_key_grant_text[0].rek_grant_text,
        );
    });

    it('should not render empty grant ids', () => {
        const publication = Object.assign({}, journalArticle);
        publication.fez_record_search_key_grant_id[0].rek_grant_id = '';
        publication.fez_record_search_key_grant_text = [
            { rek_grant_text: 'testing rek_grant_text', rek_grant_text_order: 1 },
        ];

        const wrapper = setup({ publication: publication });

        const grantRow = wrapper
            .find('GrantDetails')
            .first()
            .shallow();

        expect(grantRow.find('[data-testid="rek-grant-label-0"]').text()).toBe('Grant agency');
        expect(grantRow.find('[data-testid="rek-grant-text-0"]').text()).toBe('testing rek_grant_text');
    });

    it('should not break if grant text is not in the record', () => {
        const { ...publicationToTest } = journalArticle;
        delete publicationToTest.fez_record_search_key_grant_text;
        const wrapper = setup({ publication: publicationToTest });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not break if rek_grant_id is not in the search key', () => {
        const { fez_record_search_key_grant_id: fsrkGrantID, ...journalArticleWithoutRekGrantId } = journalArticle;
        const fsrkwithouGrantID = fsrkGrantID.map(grantId => {
            delete grantId.rek_grant_id;
            return grantId;
        });

        const newJournalArticle = {
            ...journalArticleWithoutRekGrantId,
            fez_record_search_key_grant_id: fsrkwithouGrantID,
        };

        const wrapper = setup({ publication: newJournalArticle });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
