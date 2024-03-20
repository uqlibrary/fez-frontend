import React from 'react';
import { journalArticle } from 'mock/data/testing/records';
import GrantInformation from './GrantInformation';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        publication: journalArticle,
        actions: testProps.actions,
        classes: {},
        ...testProps,
    };
    return rtlRender(<GrantInformation {...props} />);
}

describe('Grant Information Component ', () => {
    it('should render component', () => {
        const { container, getAllByTestId } = setup({});
        expect(container).toMatchSnapshot();
        expect(getAllByTestId('rek-grant-text').length).toEqual(1);
    });

    it('should not render component with empty publication', () => {
        const { container } = setup({ publication: {} });
        expect(container).toMatchSnapshot();
    });

    it('should render with publication without grant id data', () => {
        const publication = Object.assign({}, journalArticle);
        delete publication.fez_record_search_key_grant_id;
        const { getByTestId } = setup({ publication: publication });

        // const grantRow = wrapper.find('GrantDetails').first();
        expect(getByTestId('rek-grant-label-0')).toHaveTextContent('Grant agency');
        expect(getByTestId('rek-grant-text-0')).toHaveTextContent('');
    });

    it('should not render empty grant ids', () => {
        const publication = Object.assign({}, journalArticle);
        publication.fez_record_search_key_grant_id[0].rek_grant_id = '';
        publication.fez_record_search_key_grant_text = [
            { rek_grant_text: 'testing rek_grant_text', rek_grant_text_order: 1 },
        ];

        const { getByTestId } = setup({ publication: publication });

        // const grantRow = wrapper.find('GrantDetails').first();

        expect(getByTestId('rek-grant-label-0')).toHaveTextContent('Grant agency');
        expect(getByTestId('rek-grant-text-0')).toHaveTextContent('');
    });

    it('should not break if grant text is not in the record', () => {
        const { ...publicationToTest } = journalArticle;
        delete publicationToTest.fez_record_search_key_grant_text;
        const { container } = setup({ publication: publicationToTest });
        expect(container).toMatchSnapshot();
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

        const { container } = setup({ publication: newJournalArticle });
        expect(container).toMatchSnapshot();
    });
});
