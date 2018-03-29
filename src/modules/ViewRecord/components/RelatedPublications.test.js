import {dataCollection} from 'mock/data/testing/records';
import RelatedPublications from "./RelatedPublications";

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        publication: testProps.publication || dataCollection,
        title: testProps.title || '',
        actions: testProps.actions || {},
        showPublicationTitle: testProps.showPublicationTitle || false,
        fields: testProps.fields ||
        [
            {field: 'fez_record_search_key_related_publications', subKey: 'rek_related_publications'},
            {field: 'fez_record_search_key_related_datasets', subKey: 'rek_related_datasets'}
        ]
    };
    return getElement(RelatedPublications, props, isShallow);
}

describe('Related publications Component ', () => {
    it('should render component', () => {
        const wrapper = setup({}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.relatedPublications li').length).toEqual(3);
    });

    it('should render component with empty data', () => {
        const wrapper = setup({publication: {}});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.relatedPublications').length).toEqual(1);
    });

    it('should render component with empty publications', () => {
        const publication = Object.assign({}, dataCollection);
        publication.fez_record_search_key_related_publications = null;
        const wrapper = setup({publication: publication});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.relatedPublications').length).toEqual(1);
        expect(wrapper.find('.relatedPublications li').length).toEqual(2);
    });

    it('should render component with empty datasets', () => {
        const publication = Object.assign({}, dataCollection);
        publication.fez_record_search_key_related_datasets = null;
        const wrapper = setup({publication: publication});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.relatedPublications').length).toEqual(1);
        expect(wrapper.find('.relatedPublications li').length).toEqual(1);
    });
});
