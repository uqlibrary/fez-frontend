import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import { PubmedCentralLink } from 'modules/SharedComponents/PubmedCentralLink';
// eslint-disable-next-line max-len
import DoiCitationView from 'modules/SharedComponents/PublicationCitation/components/citations/partials/DoiCitationView';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import OpenAccessIcon from 'modules/SharedComponents/Partials/OpenAccessIcon';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import locale from 'locale/viewRecord';
import { openAccessConfig } from 'config';
import { DOI_CROSSREF_PREFIX, DOI_DATACITE_PREFIX } from 'config/general';
import moment from 'moment';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import componentsLocale from 'locale/components';
import { getDownloadLicence } from 'helpers/licence';

export class Links extends PureComponent {
    static propTypes = {
        publication: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            link: undefined,
            licence: undefined,
        };
    }
    openRdmDownloadUrl = url => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    LinkRow = ({ link, linkId, description, openAccessStatus }) => (
        <Grid
            container
            spacing={2}
            sx={theme => ({
                padding: {
                    xs: `${theme.spacing(1)} 0`,
                    sm: `${theme.spacing(2)} ${theme.spacing(1)} ${theme.spacing(1)} ${theme.spacing(1)}`,
                },
                borderBottom: `1px solid ${theme.palette.secondary.light}`,
            })}
            alignItems={'center'}
            alignContent={'center'}
            justifyContent={'center'}
        >
            <Grid xs={12} sm={6} data-testid={`${linkId}-link`}>
                <Typography variant={'body2'} component={'span'}>
                    {link}
                </Typography>
            </Grid>
            <Grid
                xs={11}
                sm={4}
                whiteSpace={'nowrap'}
                textOverflow={'ellipsis'}
                overflow={'hidden'}
                data-analyticsid={`${linkId}-description`}
                data-testid={`${linkId}-description`}
            >
                <Typography variant={'body2'} component={'span'}>
                    {description}
                </Typography>
            </Grid>
            <Grid xs={1} sm={2} style={{ textAlign: 'right' }} data-testid={`${linkId}-oa-status`}>
                <OpenAccessIcon {...openAccessStatus} style={{ marginBottom: '-5px' }} />
            </Grid>
        </Grid>
    );

    getDOILink = (doi, openAccessStatus) => {
        if (doi.indexOf(DOI_CROSSREF_PREFIX) === -1 && doi.indexOf(DOI_DATACITE_PREFIX) === -1) {
            return {
                index: 'doi',
                link: <DoiCitationView doi={doi} />,
                description: locale.viewRecord.sections.links.doiDescription,
                openAccessStatus: openAccessStatus,
            };
        } else {
            return null;
        }
    };

    getPMCLink = (pubmedCentralId, openAccessStatus) => {
        return {
            index: 'pmc',
            link: <PubmedCentralLink pubmedCentralId={pubmedCentralId} />,
            description: locale.viewRecord.sections.links.pubmedCentralLinkDescription,
            openAccessStatus: openAccessStatus,
        };
    };

    getGoogleScholarLink = (title, openAccessStatus) => {
        return {
            index: 'google',
            link: (
                <ExternalLink
                    id="google-scholar"
                    href={locale.viewRecord.sections.links.googleScholar.linkPrefix.replace('[title]', title)}
                    title={locale.viewRecord.sections.links.googleScholar.linkDescription}
                >
                    {locale.viewRecord.sections.links.googleScholar.linkPrefix
                        .replace('[title]', title)
                        .replace('%22', '"')}
                </ExternalLink>
            ),
            description: locale.viewRecord.sections.links.googleScholar.linkDescription,
            openAccessStatus: openAccessStatus,
        };
    };

    getRDMLinkOAStatus = record => {
        const currentDate = moment().format();
        const openAccessStatusId =
            record.fez_record_search_key_access_conditions &&
            record.fez_record_search_key_access_conditions.rek_access_conditions
                ? parseInt(record.fez_record_search_key_access_conditions.rek_access_conditions, 10)
                : null;
        const embargoDate =
            openAccessStatusId === openAccessConfig.DATASET_OPEN_ACCESS_ID &&
            record.fez_record_search_key_embargo_to &&
            record.fez_record_search_key_embargo_to.rek_embargo_to &&
            record.fez_record_search_key_embargo_to.rek_embargo_to > currentDate
                ? record.fez_record_search_key_embargo_to.rek_embargo_to
                : null;
        const isOpenAccess = !!openAccessStatusId
            ? openAccessStatusId === openAccessConfig.DATASET_OPEN_ACCESS_ID && !embargoDate
            : null;
        return {
            isOpenAccess: isOpenAccess,
            embargoDate: embargoDate,
            openAccessStatusId: openAccessStatusId,
            showEmbargoText: !!(!isOpenAccess && embargoDate),
        };
    };

    getPublicationLink = (link, index, isLinkNoDoi) => {
        const isRDM = !!link.rek_link.match(/^https?:\/\/[a-z0-9\-]*\.?rdm\.uq\.edu\.au/i);
        const defaultDescription = isRDM
            ? locale.viewRecord.sections.links.rdmLinkMissingDescriptionTitle
            : locale.viewRecord.sections.links.linkMissingDescriptionTitle;
        const linkDescription =
            (this.props.publication.fez_record_search_key_link_description &&
                this.props.publication.fez_record_search_key_link_description[index] &&
                this.props.publication.fez_record_search_key_link_description[index].rek_link_description) ||
            defaultDescription;

        const linkNoDoiOpenAccessStatus = {
            isOpenAccess: true,
            embargoDate: null,
            openAccessStatusId: openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI,
        };

        const openAccessStatus = isRDM
            ? this.getRDMLinkOAStatus(this.props.publication)
            : (isLinkNoDoi && linkNoDoiOpenAccessStatus) || {};

        const licence = getDownloadLicence(this.props.publication);

        return {
            index: index,
            link: (
                <ExternalLink
                    href={link.rek_link}
                    title={linkDescription}
                    id={`publication-${index}`}
                    {...(isRDM && openAccessStatus.isOpenAccess && !!licence
                        ? {
                              onClick: e => {
                                  e.preventDefault();
                                  this.setState({
                                      isOpen: true,
                                      link: link.rek_link,
                                      licence: componentsLocale.components.attachedFiles.licenceConfirmation(licence),
                                  });
                              },
                          }
                        : {})}
                >
                    {link.rek_link}
                </ExternalLink>
            ),
            description: linkDescription,
            openAccessStatus: openAccessStatus,
        };
    };

    render() {
        const record = this.props.publication;

        const txt = locale.viewRecord.sections.links;
        const pubmedCentralId =
            record.fez_record_search_key_pubmed_central_id &&
            record.fez_record_search_key_pubmed_central_id.rek_pubmed_central_id;
        const doi =
            record.fez_record_search_key_doi &&
            record.fez_record_search_key_doi.rek_doi &&
            this.getDOILink(record.fez_record_search_key_doi.rek_doi)
                ? record.fez_record_search_key_doi.rek_doi
                : null;
        const openAccessStatusId =
            record.fez_record_search_key_oa_status && record.fez_record_search_key_oa_status.rek_oa_status;
        const hasLinks = record.fez_record_search_key_link && record.fez_record_search_key_link.length > 0;
        const isLinkNoDoi = openAccessStatusId === openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI;

        const pmcOpenAccessStatus = {
            isOpenAccess: true,
            embargoDate: null,
            openAccessStatusId: openAccessConfig.OPEN_ACCESS_ID_PMC,
        };

        const gcOpenAccessStatus = {
            isOpenAccess: false,
            embargoDate: null,
            openAccessStatusId: openAccessConfig.OPEN_ACCESS_ID_PMC,
        };

        const doiOpenAccessStatus =
            record.calculateOpenAccess && openAccessStatusId === openAccessConfig.OPEN_ACCESS_ID_DOI
                ? record.calculateOpenAccess()
                : {};

        if (
            !(
                (record.fez_record_search_key_link && record.fez_record_search_key_link.length > 0) ||
                (record.fez_record_search_key_pubmed_central_id &&
                    record.fez_record_search_key_pubmed_central_id.rek_pubmed_central_id) ||
                (record.fez_record_search_key_doi && record.fez_record_search_key_doi.rek_doi && !!doi) ||
                (record.fez_record_search_key_oa_status &&
                    record.fez_record_search_key_oa_status.rek_oa_status ===
                        openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI)
            )
        ) {
            return null;
        }

        return (
            <Grid xs={12}>
                <ConfirmationBox
                    confirmationBoxId="link-rdm-accept-licence"
                    isOpen={this.state.isOpen}
                    onAction={() => this.openRdmDownloadUrl(this.state.link)}
                    onClose={() => this.setState({ isOpen: false, link: undefined })}
                    locale={this.state.licence}
                />
                <StandardCard title={txt.title}>
                    <Grid
                        container
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        padding={0}
                        sx={theme => ({
                            padding: {
                                xs: `${theme.spacing(1)} 0`,
                                sm: `${theme.spacing(2)} ${theme.spacing(1)} ${theme.spacing(1)} ${theme.spacing(1)}`,
                            },
                            borderBottom: `1px solid ${theme.palette.secondary.light}`,
                        })}
                    >
                        <Grid sm={6} data-testid="link-label">
                            <Typography variant="caption" gutterBottom>
                                {txt.headerTitles.link}
                            </Typography>
                        </Grid>
                        <Grid sm={4} data-testid="description-label" sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="caption" gutterBottom>
                                {txt.headerTitles.description}
                            </Typography>
                        </Grid>
                        <Grid sm={2} data-testid="oa-status-label">
                            <Typography variant="caption" gutterBottom>
                                {txt.headerTitles.oaStatus}
                            </Typography>
                        </Grid>
                    </Grid>
                    {// if record has a PubMedCentral Id - display link, should be always OA
                    !!pubmedCentralId && (
                        <this.LinkRow
                            linkId="rek-pubmed-central-id"
                            {...this.getPMCLink(pubmedCentralId, pmcOpenAccessStatus)}
                        />
                    )}
                    {// if record has a DOI - display a link, should be OA or OA with a date
                    !!doi && <this.LinkRow linkId="rek-doi" {...this.getDOILink(doi, doiOpenAccessStatus)} />}
                    {// record has OA status of "Link (no DOI)" and has no actual links of its own
                    // then produce a google scholar link for the publication title
                    openAccessStatusId === openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI &&
                        record.fez_record_search_key_link &&
                        record.fez_record_search_key_link.length === 0 && (
                            <this.LinkRow
                                linkId="rek-title"
                                {...this.getGoogleScholarLink(record.rek_title, gcOpenAccessStatus)}
                            />
                        )}
                    {hasLinks &&
                        record.fez_record_search_key_link.map((item, index) => (
                            <this.LinkRow
                                linkId={`rek-link-${index}`}
                                {...this.getPublicationLink(item, index, isLinkNoDoi)}
                                key={index}
                            />
                        ))}
                </StandardCard>
            </Grid>
        );
    }
}

export default Links;
