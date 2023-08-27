import React from 'react';
import PageRangeCitationView from './PageRangeCitationView';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    // build full props list required by the component
    const props = {
        classes: {},
        publication: testProps.publication || {},
        ...testProps,
    };
    return rtlRender(<PageRangeCitationView {...props} />);
}

describe('PageRangeCitationView test ', () => {
    it('should render nothing if search key not found', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render startPage only', () => {
        const { container } = setup({
            publication: {
                fez_record_search_key_start_page: {
                    rek_start_page: 11,
                },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render endPage only', () => {
        const { container } = setup({
            publication: {
                fez_record_search_key_end_page: {
                    rek_end_page: 11,
                },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render startPage to endPage', () => {
        const { container } = setup({
            publication: {
                fez_record_search_key_start_page: {
                    rek_start_page: 13,
                },
                fez_record_search_key_end_page: {
                    rek_end_page: 17,
                },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render startPage only if end page is empty', () => {
        const { container } = setup({
            publication: {
                fez_record_search_key_start_page: {
                    rek_start_page: 13,
                },
                fez_record_search_key_end_page: {},
            },
        });
        expect(container).toMatchSnapshot();
    });
});
