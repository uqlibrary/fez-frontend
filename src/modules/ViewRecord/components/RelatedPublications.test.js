import {dataCollection} from 'mock/data/testing/records';
import RelatedPublications from "./RelatedPublications";

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        publication: testProps.publication || dataCollection,
        title: testProps.title || '',
        actions: testProps.actions || {},
        showPublicationTitle: testProps.showPublicationTitle || false,
        field: testProps.field || 'fez_record_search_key_has_related_datasets',
        subKey: testProps.subKey || 'rek_has_related_datasets'
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

    it('should call loadRecordToView action on click', () => {
        const loadRecordToViewFuncion = jest.fn();
        const wrapper = setup({actions: {loadRecordToView: loadRecordToViewFuncion}});
        const fileTitle = wrapper.find('.publicationList Link').first();
        fileTitle.simulate('click');
        expect(loadRecordToViewFuncion).toHaveBeenCalledTimes(1);
    });
});
