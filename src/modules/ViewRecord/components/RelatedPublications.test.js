import {dataCollection} from 'mock/data/testing/records';
import RelatedPublications from "./RelatedPublications";

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        publication: testProps.publication || dataCollection,
        title: testProps.title || ''
    };
    return getElement(RelatedPublications, props, isShallow);
}

describe('Related publications Component ', () => {
    it('should render component', () => {
        const wrapper = setup({}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.relatedPublications li').length).toEqual(2);
    });

    it('should not render component with empty data', () => {
        const publication = Object.assign({}, dataCollection);
        publication.fez_record_search_key_has_related_datasets = null;
        const wrapper = setup({publication: publication});
        expect(toJson(wrapper)).toEqual('');
    });

    it('should not render data with empty lookups', () => {
        const publication = Object.assign({}, dataCollection);
        publication.fez_record_search_key_has_related_datasets.push({
            rek_has_related_datasets_lookup: null,
            rek_has_related_datasets_order: 3
        }, {
            rek_has_related_datasets_lookup: " ",
            rek_has_related_datasets_order: 4
        });
        const wrapper = setup({publication: publication});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.relatedPublications li').length).toEqual(2);
    });
});
