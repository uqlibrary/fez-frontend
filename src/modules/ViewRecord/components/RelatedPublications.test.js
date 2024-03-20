import React from 'react';
import { dataCollection, recordWithRelatedItems } from 'mock/data/testing/records';
import RelatedPublications from './RelatedPublications';
import { rtlRender, WithRouter } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        classes: { list: 'list' },
        publication: testProps.publication || dataCollection,
        title: testProps.title || '',
        ...testProps,
    };
    return rtlRender(
        <WithRouter>
            <RelatedPublications {...props} />
        </WithRouter>,
    );
}

describe('Related publications Component ', () => {
    it('should render component', () => {
        const { container, getAllByRole } = setup({
            publication: dataCollection,
            title: 'Title',
        });
        expect(container).toMatchSnapshot();
        expect(getAllByRole('listitem').length).toEqual(2);
    });

    it('should not render component with empty data', () => {
        const publication = Object.assign({}, dataCollection);
        publication.fez_record_search_key_has_related_datasets = null;
        const { container } = setup({ publication: publication });
        expect(container.firstChild).toBeNull();
    });

    it('should not render data with empty lookups', () => {
        const publication = Object.assign({}, dataCollection);
        publication.fez_record_search_key_has_related_datasets.push(
            {
                rek_has_related_datasets_lookup: null,
                rek_has_related_datasets_order: 3,
            },
            {
                rek_has_related_datasets_lookup: ' ',
                rek_has_related_datasets_order: 4,
            },
        );
        const { container, getAllByRole } = setup({ publication: publication });
        expect(container).toMatchSnapshot();
        expect(getAllByRole('listitem').length).toEqual(2);
    });

    it('should render with a publication title', () => {
        const { container } = setup({
            publication: dataCollection,
            title: 'A test Title',
            showPublicationTitle: true,
        });
        expect(container).toMatchSnapshot();
    });

    it('should render without a child search key', () => {
        const { container } = setup({
            publication: dataCollection,
            title: 'Title',
            parentSearchKey: {
                key: 'fez_record_search_key_isderivationof',
                pid: 'rek_isderivationof',
                title: 'rek_isderivationof_lookup',
                order: 'rek_isderivationof_order',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render without a parent search key', () => {
        const { container } = setup({
            publication: recordWithRelatedItems,
            title: 'Title',
            parentSearchKey: {
                key: 'fez_record_search_key_isderivationof',
                pid: 'rek_isderivationof',
                title: 'rek_isderivationof_lookup',
                order: 'rek_isderivationof_order',
            },
        });
        expect(container).toMatchSnapshot();
    });
});
