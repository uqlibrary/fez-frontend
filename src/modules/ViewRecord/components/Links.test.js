import React from 'react';

import Links from './Links';
import { recordLinks, recordWithRDM, recordWithRdmMediatedAccess } from 'mock/data/testing/records';
import { openAccessConfig } from 'config';
import { calculateOpenAccess } from 'middleware/publicationEnhancer';
import { WithRouter, fireEvent, rtlRender } from 'test-utils';
import { getIconTestId } from '../../SharedComponents/Partials/OpenAccessIcon';

function setup(testProps = {}) {
    const props = {
        classes: {},
        publication: recordLinks,
        isAdmin: false,
        ...testProps,
    };
    return rtlRender(
        <WithRouter>
            <Links {...props} />
        </WithRouter>,
    );
}

describe('Component Links ', () => {
    const getPublication = (
        embargoDays = 0,
        oaStatus = openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI,
        hasLinks = true,
    ) => ({
        fez_record_search_key_oa_embargo_days: {
            rek_oa_embargo_days: embargoDays,
        },
        rek_date: '2019-12-25T00:00:00Z',
        fez_record_search_key_oa_status: {
            rek_oa_status_id: 281706,
            rek_oa_status_pid: 'UQ:396321',
            rek_oa_status_xsdmf_id: 16607,
            rek_oa_status: oaStatus,
        },
        ...(oaStatus === openAccessConfig.OPEN_ACCESS_ID_DOI
            ? {
                  fez_record_search_key_doi: {
                      rek_doi_id: 1706266,
                      rek_doi_pid: 'UQ:795721',
                      rek_doi_xsdmf_id: 16514,
                      rek_doi: '10.1016/j.pnsc.2012.12.004',
                  },
              }
            : {}),
        ...(hasLinks
            ? {
                  fez_record_search_key_link: [
                      {
                          rek_link_id: 3240198,
                          rek_link_pid: 'UQ:795347',
                          rek_link_xsdmf_id: null,
                          rek_link: 'http://www.thisisatest.com',
                          rek_link_order: 1,
                      },
                      {
                          rek_link_id: 3240199,
                          rek_link_pid: 'UQ:795347',
                          rek_link_xsdmf_id: null,
                          rek_link: 'http://www.thisisanothertest.com',
                          rek_link_order: 2,
                      },
                      {
                          rek_link_id: 3240200,
                          rek_link_pid: 'UQ:795347',
                          rek_link_xsdmf_id: null,
                          rek_link: 'http://www.nodescription.com',
                          rek_link_order: 2,
                      },
                  ],
              }
            : { fez_record_search_key_link: [] }),
        fez_record_search_key_link_description: [
            {
                rek_link_description_id: 3240198,
                rek_link_description_pid: 'UQ:795347',
                rek_link_description_xsdmf_id: null,
                rek_link_description: 'Link to publication',
                rek_link_description_order: 1,
            },
            {
                rek_link_description_id: 3240199,
                rek_link_description_pid: 'UQ:795347',
                rek_link_description_xsdmf_id: null,
                rek_link_description: 'Another link to publication',
                rek_link_description_order: 1,
            },
            {
                rek_link_description_id: 3240200,
                rek_link_description_pid: 'UQ:795347',
                rek_link_description_xsdmf_id: null,
                rek_link_description: null,
                rek_link_description_order: 1,
            },
        ],
        calculateOpenAccess() {
            return calculateOpenAccess(this);
        },
    });

    const MockDate = require('mockdate');
    beforeEach(() => {
        MockDate.set('2020-01-01T00:00:00.000Z', 10);
    });

    afterEach(() => {
        MockDate.reset();
    });

    it('should not render component for empty publication', () => {
        const { container } = setup({ publication: {} });
        expect(container).toMatchSnapshot();
    });

    it('Rendering due to a pubmed central id', () => {
        const { container } = setup({
            publication: {
                fez_record_search_key_pubmed_central_id: { rek_pubmed_central_id: '12345' },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('Rendering due to a doi', () => {
        const { container } = setup({
            publication: {
                fez_record_search_key_doi: { rek_doi: '12345' },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('Will not render a UQ generated doi', () => {
        const { container } = setup({
            publication: {
                fez_record_search_key_doi: { rek_doi: '10.14264' },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('Rendering due to being open access link no doi', () => {
        const { container } = setup({
            publication: {
                fez_record_search_key_oa_status: {
                    rek_oa_status: openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI,
                    rek_oa_status_lookup: 'Link (no DOI)',
                },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('Full mount render', () => {
        const { container } = setup({ publication: recordLinks });
        expect(container).toMatchSnapshot();
    });

    it('should render only an OA google scholar link for OPEN_ACCESS_ID_LINK_NO_DOI with no links', () => {
        const { container } = setup({
            publication: getPublication(0, openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI, false),
        });
        expect(container).toMatchSnapshot();
    });

    it('should render 3 non OA links and NO OA google scholar link for OPEN_ACCESS_ID_LINK_NO_DOI with links', () => {
        const { container } = setup({ publication: getPublication() });
        expect(container).toMatchSnapshot();
    });

    it('should render list of 3 not OA links and DOI link with OA Embargo date set for OPEN_ACCESS_ID_DOI', () => {
        const { container, getAllByTestId } = setup({
            publication: getPublication(365, openAccessConfig.OPEN_ACCESS_ID_DOI),
        });
        expect(container).toMatchSnapshot();
        expect(getAllByTestId(getIconTestId('embargoed-oa')).length).toEqual(1);
    });

    it('should render 3 not OA links and DOI and PMC links with OA for OPEN_ACCESS_ID_DOI', () => {
        const pmcProps = {
            ...getPublication(0, openAccessConfig.OPEN_ACCESS_ID_DOI),
            fez_record_search_key_pubmed_central_id: {
                rek_pubmed_central_id_id: 12345678901,
                rek_pubmed_central_id_pid: 'UQ:1234',
                rek_pubmed_central_id_xsdmf_id: 1234,
                rek_pubmed_central_id: 'PMC5179926',
            },
        };

        const { container, getAllByTestId } = setup({ publication: pmcProps });
        expect(container).toMatchSnapshot();
        expect(getAllByTestId(getIconTestId('oa-n/a')).length).toEqual(3);
        expect(getAllByTestId(getIconTestId('oa')).length).toEqual(2);
    });

    it('should render 3 not OA links and PMC link with OA for OPEN_ACCESS_ID_PMC', () => {
        const pmcProps = {
            ...getPublication(0, openAccessConfig.OPEN_ACCESS_ID_PMC),
            fez_record_search_key_pubmed_central_id: {
                rek_pubmed_central_id_id: 12345678901,
                rek_pubmed_central_id_pid: 'UQ:1234',
                rek_pubmed_central_id_xsdmf_id: 1234,
                rek_pubmed_central_id: 'PMC5179926',
            },
        };

        const { container, getAllByTestId } = setup({ publication: pmcProps });
        expect(container).toMatchSnapshot();
        expect(getAllByTestId(getIconTestId('oa-n/a')).length).toEqual(3);
        expect(getAllByTestId(getIconTestId('oa')).length).toEqual(1);
    });

    it('should render 3 not OA links and PMC with OA and DOI link no OA for OPEN_ACCESS_ID_PMC', () => {
        const pmcProps = {
            ...getPublication(0, openAccessConfig.OPEN_ACCESS_ID_PMC),
            fez_record_search_key_pubmed_central_id: {
                rek_pubmed_central_id_id: 12345678901,
                rek_pubmed_central_id_pid: 'UQ:1234',
                rek_pubmed_central_id_xsdmf_id: 1234,
                rek_pubmed_central_id: 'PMC5179926',
            },
            fez_record_search_key_doi: {
                rek_doi_id: 1706266,
                rek_doi_pid: 'UQ:795721',
                rek_doi_xsdmf_id: 16514,
                rek_doi: '10.1016/j.pnsc.2012.12.004',
            },
        };

        const { container, getAllByTestId } = setup({ publication: pmcProps });
        expect(container).toMatchSnapshot();
        expect(getAllByTestId(getIconTestId('oa-n/a')).length).toEqual(4);
        expect(getAllByTestId(getIconTestId('oa')).length).toEqual(1);
    });

    // prettier-ignore
    it('should render 3 not OA links and DOI not OA and PMC always OA link for OPEN_ACCESS_ID_FILE_AUTHOR_POSTPRINT', () => {
        const pmcProps = {
            ...getPublication(0, openAccessConfig.OPEN_ACCESS_ID_FILE_AUTHOR_POSTPRINT),
            fez_record_search_key_pubmed_central_id: {
                rek_pubmed_central_id_id: 12345678901,
                rek_pubmed_central_id_pid: 'UQ:1234',
                rek_pubmed_central_id_xsdmf_id: 1234,
                rek_pubmed_central_id: 'PMC5179926',
            },
            fez_record_search_key_doi: {
                rek_doi_id: 1706266,
                rek_doi_pid: 'UQ:795721',
                rek_doi_xsdmf_id: 16514,
                rek_doi: '10.1016/j.pnsc.2012.12.004',
            },
        };

        const { container, queryAllByTestId } = setup({ publication: pmcProps });
        expect(container)
            .toMatchSnapshot();
        expect(queryAllByTestId(getIconTestId('oa-n/a')).length).toEqual(4);
        expect(queryAllByTestId(getIconTestId('oa')).length).toEqual(1);
    });

    it('should render OA for OPEN_ACCESS_ID_FILE_AUTHOR_PREPRINT', () => {
        const pmcProps = {
            ...getPublication(0, openAccessConfig.OPEN_ACCESS_ID_FILE_AUTHOR_PREPRINT),
            fez_record_search_key_pubmed_central_id: {
                rek_pubmed_central_id_id: 12345678901,
                rek_pubmed_central_id_pid: 'UQ:1234',
                rek_pubmed_central_id_xsdmf_id: 1234,
                rek_pubmed_central_id: 'PMC5179926',
            },
            fez_record_search_key_doi: {
                rek_doi_id: 1706266,
                rek_doi_pid: 'UQ:795721',
                rek_doi_xsdmf_id: 16514,
                rek_doi: '10.1016/j.pnsc.2012.12.004',
            },
        };

        const { container } = setup({ publication: pmcProps });
        expect(container).toMatchSnapshot();
    });

    it('should use special default description if the link has the RDM hostname', () => {
        const { container } = setup({
            publication: {
                fez_record_search_key_link: [
                    {
                        rek_link: 'https://rdm.uq.edu.au/files/example123',
                        rek_link_order: 1,
                    },
                    {
                        rek_link: 'https://rdm.uq.edu.au/files/example123',
                        rek_link_order: 2,
                    },
                ],
                fez_record_search_key_link_description: [
                    {
                        rek_link_description: 'Provided description',
                        rek_link_description_order: 1,
                    },
                    {
                        rek_link_description: null,
                        rek_link_description_order: 2,
                    },
                ],
            },
            isAdmin: true,
        });

        expect(container).toMatchSnapshot();
    });

    it('should render no oa icon and embargo dates for embargoed access rdm link', () => {
        const { container } = setup({
            publication: {
                fez_record_search_key_link: [
                    {
                        rek_link: 'https://rdm.uq.edu.au/files/example123',
                        rek_link_order: 1,
                    },
                ],
                fez_record_search_key_access_conditions: {
                    rek_access_conditions: openAccessConfig.DATASET_OPEN_ACCESS_ID,
                },
                fez_record_search_key_embargo_to: {
                    rek_embargo_to: '2100-01-01',
                },
            },
            isAdmin: true,
        });

        expect(container).toMatchSnapshot();
    });

    it('should render no oa icon for mediated access rdm link', () => {
        const { container } = setup({
            publication: {
                fez_record_search_key_link: [
                    {
                        rek_link: 'https://rdm.uq.edu.au/files/example123',
                        rek_link_order: 1,
                    },
                ],
                fez_record_search_key_access_conditions: {
                    rek_access_conditions: openAccessConfig.DATASET_MEDIATED_ACCESS_ID,
                },
            },
            isAdmin: true,
        });

        expect(container).toMatchSnapshot();
    });

    it('should render oa icon for open access rdm link', () => {
        const { container } = setup({
            publication: {
                fez_record_search_key_link: [
                    {
                        rek_link: 'https://rdm.uq.edu.au/files/example123',
                        rek_link_order: 1,
                    },
                ],
                fez_record_search_key_access_conditions: {
                    rek_access_conditions: openAccessConfig.DATASET_OPEN_ACCESS_ID,
                },
            },
        });

        expect(container).toMatchSnapshot();
    });

    it('should render oa icon for past embargo date open access rdm link', () => {
        const { container } = setup({
            publication: {
                fez_record_search_key_link: [
                    {
                        rek_link: 'https://rdm.uq.edu.au/files/example123',
                        rek_link_order: 1,
                    },
                ],
                fez_record_search_key_access_conditions: {
                    rek_access_conditions: openAccessConfig.DATASET_OPEN_ACCESS_ID,
                },
                fez_record_search_key_embargo_to: {
                    rek_embargo_to: '1900-01-01',
                },
            },
        });

        expect(container).toMatchSnapshot();
    });

    it('should render oa icon for Link (no DOI) for link', () => {
        const { container } = setup({
            publication: {
                fez_record_search_key_link: [
                    {
                        rek_link: 'https://google.com',
                        rek_link_order: 1,
                    },
                ],
                fez_record_search_key_oa_status: {
                    rek_oa_status: openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI,
                },
            },
        });

        expect(container).toMatchSnapshot();
    });

    it('should be able to trigger and cancel licence confirmation', () => {
        const { getByTestId } = setup({
            publication: recordWithRDM,
        });
        fireEvent.click(getByTestId('publication-0-link'));
        expect(getByTestId('cancel-link-rdm-accept-licence')).toBeInTheDocument();
        fireEvent.click(getByTestId('cancel-link-rdm-accept-licence'));
    });

    it('should not trigger licence popup if publication has a non-reuse licence', () => {
        const { getByTestId, queryByTestId } = setup({
            publication: {
                ...recordWithRDM,
                fez_record_search_key_license: {
                    rek_license: 456713, // cc licence
                },
            },
        });
        fireEvent.click(getByTestId('publication-0-link'));
        expect(queryByTestId('link-rdm-accept-licence')).not.toBeInTheDocument();
        // as the clicked link is a standard href with target=_blank,
        // assume clicking it worked as expected
    });

    it('should be able to trigger and accept licence confirmation', () => {
        global.open = jest.fn();
        const { getByTestId } = setup({
            publication: recordWithRDM,
        });
        fireEvent.click(getByTestId('publication-0-link'));
        expect(getByTestId('confirm-link-rdm-accept-licence')).toBeInTheDocument();
        fireEvent.click(getByTestId('confirm-link-rdm-accept-licence'));

        expect(global.open).toHaveBeenCalledWith(
            'https://rdm.uq.edu.au/files/28783df0-dbaf-11ea-96e8-37be674663fa',
            '_blank',
            'noopener,noreferrer',
        );
    });

    it('should replace RDM mediated links with a link to contact the data team for non-admin users', () => {
        const { getByTestId } = setup({
            publication: recordWithRdmMediatedAccess,
        });
        expect(getByTestId('publication-0-link')).toHaveAttribute('href', 'mailto:data@library.uq.edu.au');
        expect(getByTestId('publication-0-link')).toHaveAttribute('title', 'Send email to data@library.uq.edu.au');
    });

    it('should show RDM mediated links for Admin users', () => {
        const { getByTestId } = setup({
            publication: recordWithRdmMediatedAccess,
            isAdmin: true,
        });
        expect(getByTestId('publication-0-link')).toHaveAttribute(
            'href',
            'https://rdm.uq.edu.au/files/2944bd40-791c-11ee-bd1b-c7b4fca67552',
        );
        expect(getByTestId('publication-0-link')).toHaveAttribute('title', 'Request access');
    });
});
