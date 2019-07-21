import PageRangeCitationView from './PageRangeCitationView';

function setup(testProps = {}) {
    // build full props list required by the component
    const props = {
        classes: {},
        publication: testProps.publication || {},
        ...testProps,
    };
    return getElement(PageRangeCitationView, props);
}

describe('PageRangeCitationView test ', () => {
    it('should render nothing if search key not found', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render startPage only', () => {
        const wrapper = setup({
            publication: {
                fez_record_search_key_start_page: {
                    rek_start_page: 11,
                },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render endPage only', () => {
        const wrapper = setup({
            publication: {
                fez_record_search_key_end_page: {
                    rek_end_page: 11,
                },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render startPage to endPage', () => {
        const wrapper = setup({
            publication: {
                fez_record_search_key_start_page: {
                    rek_start_page: 13,
                },
                fez_record_search_key_end_page: {
                    rek_end_page: 17,
                },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render startPage only if end page is empty', () => {
        const wrapper = setup({
            publication: {
                fez_record_search_key_start_page: {
                    rek_start_page: 13,
                },
                fez_record_search_key_end_page: {},
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
