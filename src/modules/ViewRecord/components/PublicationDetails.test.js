import {publicationDetails} from 'mock/data/testing/records';
import PublicationDetails from "./PublicationDetails";

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        displayType: testProps.displayType || publicationDetails.rek_display_type_lookup,
        subType: testProps.subType || publicationDetails.rek_subtype,
        collections: testProps.collections || publicationDetails.fez_record_search_key_ismemberof,
        history: testProps.history || {push: jest.fn()},
        actions: testProps.actions
    };
    return getElement(PublicationDetails, props, isShallow);
}

describe('Publication Details Component ', () => {
    it('should render component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with publication without collection data', () => {
        const wrapper = setup({collections: []});
        expect(wrapper.find('.publicationDetails li').length).toEqual(0);
    });
});
