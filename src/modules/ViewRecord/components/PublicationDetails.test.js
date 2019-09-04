import { publicationDetails } from 'mock/data/testing/records';
import { PublicationDetailsClass } from './PublicationDetails';
import PublicationDetails from './PublicationDetails';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        ...testProps,
        publication: testProps.publication || publicationDetails,
        history: testProps.history || { push: jest.fn() },
        actions: testProps.actions,
        classes: { ul: 'ul', header: 'header', data: 'data', gridRow: 'gridRow' },
    };
    return getElement(PublicationDetailsClass, props, args);
}

describe('Publication Details Component ', () => {
    it('should render component', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render component with empty publication', () => {
        const wrapper = setup({ publication: {} });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with publication without subtype data', () => {
        publicationDetails.rek_subtype = null;
        const wrapper = setup({ publication: publicationDetails });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with publication without collection data', () => {
        publicationDetails.fez_record_search_key_ismemberof = [];
        const wrapper = setup({ publication: publicationDetails });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.publicationDetails li').length).toEqual(0);
    });

    it('ViewRecordRow()', () => {
        const wrapper = setup({ publication: publicationDetails });
        expect(toJson(wrapper.instance().ViewRecordRow({ heading: 'Heading', data: 'Data' }))).toMatchSnapshot();
    });

    it('Renders nothing for no display type lookup', () => {
        const wrapper = setup({
            publication: {
                ...publicationDetails,
                rek_display_type_lookup: null,
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Renders full mount', () => {
        const wrapper = getElement(
            PublicationDetails,
            {
                publication: {
                    ...publicationDetails,
                    rek_display_type_lookup: null,
                },
            },
            { isShallow: false },
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
