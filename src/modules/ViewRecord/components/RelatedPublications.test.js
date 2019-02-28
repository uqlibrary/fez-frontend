import {dataCollection} from 'mock/data/testing/records';
import {RelatedPublicationsClass} from "./RelatedPublications";
import RelatedPublications from "./RelatedPublications";

function setup(testProps, isShallow = true){
    const props = {
        classes: {list: 'list', data: 'data'},
        publication: testProps.publication || dataCollection,
        title: testProps.title || '',
        ...testProps
    };
    return getElement(RelatedPublicationsClass, props, isShallow);
}

describe('Related publications Component ', () => {
    it('should render component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.relatedPublications li').length).toEqual(2);
    });

    it('should render component', () => {
        const wrapper = getElement(RelatedPublications, {
            publication: dataCollection,
            title: 'Title'
        }, false);
        expect(toJson(wrapper)).toMatchSnapshot();
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
