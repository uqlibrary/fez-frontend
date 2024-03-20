import React from 'react';
import { publicationDetails } from 'mock/data/testing/records';
import PublicationDetails from './PublicationDetails';
import { rtlRender, WithRouter } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        publication: testProps.publication || publicationDetails,
        actions: testProps.actions,
        classes: { ul: 'ul', gridRow: 'gridRow' },
    };
    return rtlRender(
        <WithRouter>
            <PublicationDetails {...props} />
        </WithRouter>,
    );
}

describe('Publication Details Component ', () => {
    it('should render component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should not render component with empty publication', () => {
        const { container } = setup({ publication: {} });
        expect(container).toMatchSnapshot();
    });

    it('should render with publication without subtype data', () => {
        publicationDetails.rek_subtype = null;
        const { container } = setup({ publication: publicationDetails });
        expect(container).toMatchSnapshot();
    });

    it('should render with publication without collection data', () => {
        publicationDetails.fez_record_search_key_ismemberof = [];
        const { container, queryAllByRole } = setup({ publication: publicationDetails });
        expect(container).toMatchSnapshot();
        expect(queryAllByRole('listitem').length).toEqual(0);
    });
    /*
    it('ViewRecordRow()', () => {
        const { container } = setup({ publication: publicationDetails });
        expect(toJson(wrapper.instance().ViewRecordRow({ heading: 'Heading', data: 'Data' }))).toMatchSnapshot();
    });*/

    it('Renders nothing for no display type lookup', () => {
        const { container } = setup({
            publication: {
                ...publicationDetails,
                rek_display_type_lookup: null,
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('Renders full mount', () => {
        const { container } = setup({
            publication: {
                ...publicationDetails,
                rek_display_type_lookup: null,
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('Renders the Type title for Communities', () => {
        const { container } = setup({
            publication: {
                ...publicationDetails,
                rek_display_type_lookup: 'Community',
            },
        });
        expect(container).toMatchSnapshot();
    });
    it('Renders the Type & Collection title for collections with one community', () => {
        const { container } = setup({
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
        expect(container).toMatchSnapshot();
    });
    it('Renders the Type & Collection title for collections with multiple communities', () => {
        const { container } = setup({
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
        expect(container).toMatchSnapshot();
    });
});
