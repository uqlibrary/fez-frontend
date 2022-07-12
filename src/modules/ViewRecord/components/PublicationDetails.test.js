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

    it('Renders the Type title for Communities', () => {
        const wrapper = setup({
            publication: {
                ...publicationDetails,
                rek_display_type_lookup: 'Community',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    it('Renders the Type & Collection title for collections with one community', () => {
        const wrapper = setup({
            publication: {
                ...publicationDetails,
                rek_display_type_lookup: 'Collection',
                fez_record_search_key_ismemberof: [
                    {
                        rek_ismemberof_id: 12570320,
                        rek_ismemberof_pid: 'UQ:407731',
                        rek_ismemberof_xsdmf_id: null,
                        rek_ismemberof: 'UQ:289097',
                        rek_ismemberof_order: 1,
                        parent: {
                            rek_pid: 'UQ:289097',
                            rek_security_policy: 5,
                            rek_datastream_policy: 5,
                        },
                        rek_ismemberof_lookup: 'Research Data Collections',
                    },
                ],
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    it('Renders the Type & Collection title for collections with multiple communities', () => {
        const wrapper = setup({
            publication: {
                ...publicationDetails,
                rek_display_type_lookup: 'Collection',
                fez_record_search_key_ismemberof: [
                    {
                        rek_ismemberof_id: 12570320,
                        rek_ismemberof_pid: 'UQ:407731',
                        rek_ismemberof_xsdmf_id: null,
                        rek_ismemberof: 'UQ:289097',
                        rek_ismemberof_order: 1,
                        parent: {
                            rek_pid: 'UQ:289097',
                            rek_security_policy: 5,
                            rek_datastream_policy: 5,
                        },
                        rek_ismemberof_lookup: 'Research Data Collections',
                    },
                    {
                        rek_ismemberof_id: 12570321,
                        rek_ismemberof_pid: 'UQ:407731',
                        rek_ismemberof_xsdmf_id: null,
                        rek_ismemberof: 'UQ:3825',
                        rek_ismemberof_order: 2,
                        parent: {
                            rek_pid: 'UQ:3825',
                            rek_security_policy: 5,
                            rek_datastream_policy: 5,
                        },
                        rek_ismemberof_lookup: 'School of Chemistry and Molecular Biosciences',
                    },
                ],
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
