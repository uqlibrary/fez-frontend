import React from 'react';
import PageCitationView from './PageCitationView';
import { conferencePaper } from 'mock/data/testing/records';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        classes: {},
        ...testProps,
        publication: testProps.publication || {},
        searchKey: testProps.searchKey,
        className: testProps.className,
    };
    return rtlRender(<PageCitationView {...props} />);
}

describe('PageCitationView test ', () => {
    it('should render component with a mock espace record', () => {
        const { container } = setup({
            publication: conferencePaper,
            searchKey: {
                key: 'fez_record_search_key_start_page',
                subkey: 'rek_start_page',
            },
            className: 'citationPage',
        });
        expect(container).toMatchSnapshot();
    });

    it('nothing if search key not found', () => {
        const { container } = setup({
            publication: {},
            searchKey: {
                key: 'fez_record_search_key_start_page',
                subkey: 'rek_start_page',
            },
            className: 'citationPage',
        });
        expect(container).toMatchSnapshot();
    });

    it('should render component with default className', () => {
        const { container } = setup({
            publication: conferencePaper,
            searchKey: {
                key: 'fez_record_search_key_start_page',
                subkey: 'rek_start_page',
            },
        });
        expect(container).toMatchSnapshot();
    });
});
