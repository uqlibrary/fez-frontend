import {publicationDetails} from 'mock/data/testing/records';
import PublicationDetails from "./PublicationDetails";

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        publication: testProps.publication || publicationDetails,
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

    it('should render with publication without subtype data', () => {
        publicationDetails.rek_subtype = null;
        const wrapper = setup({publication: publicationDetails});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with publication without collection data', () => {
        publicationDetails.fez_record_search_key_ismemberof = [];
        const wrapper = setup({publication: publicationDetails});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.publicationDetails li').length).toEqual(0);
    });
});
