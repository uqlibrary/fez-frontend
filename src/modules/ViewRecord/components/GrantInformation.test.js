import { journalArticle } from 'mock/data/testing/records';
import { GrantInformationClass } from './GrantInformation';
import GrantInformation from './GrantInformation';

function setup(testProps, isShallow = true) {
    const props = {
        publication: journalArticle,
        history: { push: jest.fn() },
        actions: testProps.actions,
        classes: {},
        ...testProps,
    };
    return getElement(GrantInformationClass, props, isShallow);
}

describe('Grant Information Component ', () => {
    it('should render component', () => {
        const wrapper = setup({});
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
            false,
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render component with empty publication', () => {
        const wrapper = setup({ publication: {} });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with publication without grant id data', () => {
        const publication = Object.assign({}, journalArticle);
        delete publication.fez_record_search_key_grant_id;
        const wrapper = setup({ publication: publication });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render empty grant ids', () => {
        const publication = Object.assign({}, journalArticle);
        publication.fez_record_search_key_grant_id[0].rek_grant_id = '';
        const wrapper = setup({ publication: publication });

        expect(
            wrapper
                .find('.header')
                .at(0)
                .props().grantAgencyName,
        ).toEqual('Grant agency');
        expect(
            wrapper
                .find('.header')
                .at(0)
                .props().grantId,
        ).toBeFalsy();
        expect(
            wrapper
                .find('.header')
                .at(1)
                .props().grantAgencyName,
        ).toEqual('Grant agency');
        expect(
            wrapper
                .find('.header')
                .at(1)
                .props().grantId,
        ).toEqual('Grant ID');

        // expect(wrapper.find('.data').at(1).props().grantAgencyName).toEqual(
        //     'National Health and Medical Research Council'
        // );
        // expect(wrapper.find('.data').at(1).props().grantId).toBeFalsy();
        // expect(wrapper.find('.data').at(3).props().grantAgencyName).toEqual('Cancer Council Queensland');
        // expect(wrapper.find('.data').at(3).props().grantId).toEqual('1042819');
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

    it('renderGrantDetail()', () => {
        const wrapper = setup({
            publication: {
                ...journalArticle,
            },
        });
        expect(wrapper.instance().renderGrantDetail('Name', 'ID', 'Text', '1', 0)).toMatchSnapshot();
    });

    it('renderGrants() 1', () => {
        const wrapper = setup({
            fez_record_search_key_grant_text: [{ rek_grant_text: 'Test' }],
        });
        expect(toJson(wrapper.instance().renderGrants(journalArticle, true))).toMatchSnapshot();
    });
});
