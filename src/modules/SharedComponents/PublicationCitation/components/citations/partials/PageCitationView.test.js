import PageCitationView from './PageCitationView';
import { conferencePaper } from 'mock/data/testing/records';

function setup(testProps = {}) {
    const props = {
        classes: {},
        ...testProps,
        publication: testProps.publication || {},
        searchKey: testProps.searchKey,
        className: testProps.className,
    };
    return getElement(PageCitationView, props);
}

describe('PageCitationView test ', () => {
    it('should render component with a mock espace record', () => {
        const wrapper = setup({
            publication: conferencePaper,
            searchKey: {
                key: 'fez_record_search_key_start_page',
                subkey: 'rek_start_page',
            },
            className: 'citationPage',
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('nothing if search key not found', () => {
        const wrapper = setup({
            publication: {},
            searchKey: {
                key: 'fez_record_search_key_start_page',
                subkey: 'rek_start_page',
            },
            className: 'citationPage',
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with default className', () => {
        const wrapper = setup({
            publication: conferencePaper,
            searchKey: {
                key: 'fez_record_search_key_start_page',
                subkey: 'rek_start_page',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
