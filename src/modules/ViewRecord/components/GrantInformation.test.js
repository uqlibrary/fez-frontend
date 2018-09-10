import {journalArticle} from 'mock/data/testing/records';
import GrantInformation from "./GrantInformation";

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        publication: testProps.publication || journalArticle,
        history: testProps.history || {push: jest.fn()},
        actions: testProps.actions
    };
    return getElement(GrantInformation, props, isShallow);
}

describe('Grant Information Component ', () => {
    it('should render component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Table.grantInformation').length).toEqual(1);
    });

    it('should not render component with empty publication', () => {
        const wrapper = setup({publication: {}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with publication without grant id data', () => {
        const publication = Object.assign({}, journalArticle);
        delete publication['fez_record_search_key_grant_id'];
        const wrapper = setup({publication: publication});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it.skip('should not render empty grant ids', () => {
        const publication = Object.assign({}, journalArticle);
        publication['fez_record_search_key_grant_id'][0]['rek_grant_id'] = '';
        const wrapper = setup({publication: publication}, false);
        expect(wrapper.find('TableRowColumn.header').at(0).text()).toEqual('Grant agency');
        expect(wrapper.find('TableRowColumn.data').at(0).text()).toEqual('National Health and Medical Research Council');
        expect(wrapper.find('TableRowColumn.header').at(1).text()).toEqual('Grant agency (Grant ID)');
        expect(wrapper.find('TableRowColumn.data').at(1).text()).toEqual('Cancer Council Queensland (1042819)');
    });

    it('should not break if grant text is not in the record', () => {
        const {fez_record_search_key_grant_text, ...journalArticleWithoutGrantText} = journalArticle;
        const wrapper = setup({publication: journalArticleWithoutGrantText});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not break if rek_grant_id is not in the search key', () => {
        const {fez_record_search_key_grant_id, ...journalArticleWithoutRekGrantId} = journalArticle;
        const fez_record_search_key_without_grant_id = fez_record_search_key_grant_id.map(grantId => {
            const {rek_grant_id, ...rest} = grantId;
            return rest;
        });

        const newJournalArticle = {
            ...journalArticleWithoutRekGrantId,
            fez_record_search_key_grant_id: fez_record_search_key_without_grant_id
        };

        const wrapper = setup({publication: newJournalArticle});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
