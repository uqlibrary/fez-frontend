import React from 'react';
import DataCollectionCitation from './DataCollectionCitation';
import { dataCollection } from 'mock/data/testing/records';
import { render, WithRouter } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return render(
        <WithRouter>
            <DataCollectionCitation {...props} />
        </WithRouter>,
    );
}

describe('DataCollectionCitation renders ', () => {
    it('component with empty publication', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const { container } = setup({ publication: { ...dataCollection } });
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record with a missing title', () => {
        const { container } = setup({ publication: { ...dataCollection, rek_title: null } });
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record with a missing date', () => {
        const { container } = setup({ publication: { ...dataCollection, rek_date: null } });
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record with missing authors', () => {
        const { container } = setup({ publication: { ...dataCollection, fez_record_search_key_author: null } });
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record with missing publisher', () => {
        const { container } = setup({ publication: { ...dataCollection, fez_record_search_key_publisher: null } });
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record with missing document type', () => {
        const { container } = setup({ publication: { ...dataCollection, rek_display_type_lookup: null } });
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record with missing doi', () => {
        const { container } = setup({ publication: { ...dataCollection, fez_record_search_key_doi: null } });
        expect(container).toMatchSnapshot();
    });
});
