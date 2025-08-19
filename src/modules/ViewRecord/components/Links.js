import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import locale from 'locale/viewRecord';
import { openAccessConfig, viewRecordsConfig } from 'config';
import { DOI_CROSSREF_PREFIX, DOI_DATACITE_PREFIX, dataTeamCollections } from 'config/general';
import componentsLocale from 'locale/components';
import { getDownloadLicence } from 'helpers/licence';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { PubmedCentralLink } from 'modules/SharedComponents/PubmedCentralLink';
import DoiCitationView from 'modules/SharedComponents/PublicationCitation/components/citations/partials/DoiCitationView';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import OpenAccessIcon from 'modules/SharedComponents/Partials/OpenAccessIcon';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

export const isDataTeamCollection = publication =>
    dataTeamCollections.some(pid => {
        return publication.fez_record_search_key_ismemberof?.find(item => item.rek_ismemberof === pid);
    });

const Links = ({ publication, isAdmin }) => {
    const [state, setState] = useState({ isOpen: false, link: undefined, licence: undefined });

    const openRdmDownloadUrl = url => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const LinkRow = ({ link, linkId, description, openAccessStatus }) => (
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
    LinkRow.propTypes = {
        link: PropTypes.node,
        linkId: PropTypes.string,
        description: PropTypes.string,
        openAccessStatus: PropTypes.object,
    };

    const getDOILink = (doi, openAccessStatus) => {
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

    const getPMCLink = (pubmedCentralId, openAccessStatus) => {
        return {
            index: 'pmc',
            link: <PubmedCentralLink pubmedCentralId={pubmedCentralId} />,
            description: locale.viewRecord.sections.links.pubmedCentralLinkDescription,
            openAccessStatus: openAccessStatus,
        };
    };

    const getGoogleScholarLink = (title, openAccessStatus) => {
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

    const getRDMLinkOAStatus = record => {
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

    const getPublicationLink = (link, index, isLinkNoDoi) => {
        const isRDM = !!link.rek_link.match(/^https?:\/\/[a-z0-9\-]*\.?rdm\.uq\.edu\.au/i);
        const defaultDescription = isRDM
            ? locale.viewRecord.sections.links.rdmLinkMissingDescriptionTitle
            : locale.viewRecord.sections.links.linkMissingDescriptionTitle;
        const linkDescription =
            (publication.fez_record_search_key_link_description &&
                publication.fez_record_search_key_link_description[index] &&
                publication.fez_record_search_key_link_description[index].rek_link_description) ||
            defaultDescription;

        const linkNoDoiOpenAccessStatus = {
            isOpenAccess: true,
            embargoDate: null,
            openAccessStatusId: openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI,
        };

        const openAccessStatus = isRDM
            ? getRDMLinkOAStatus(publication)
            : (isLinkNoDoi && linkNoDoiOpenAccessStatus) || {};

        const mustRequestRdmAccessFromDataTeam =
            isRDM && !openAccessStatus.isOpenAccess && !isAdmin && isDataTeamCollection(publication);

        const variableLinkDetails = {
            href: mustRequestRdmAccessFromDataTeam ? `mailto:${viewRecordsConfig.genericDataEmail}` : link.rek_link,
            title: mustRequestRdmAccessFromDataTeam
                ? locale.viewRecord.sections.links.rdmRequestAccessTitle.replace(
                      '[data_email]',
                      viewRecordsConfig.genericDataEmail,
                  )
                : linkDescription,
            text: mustRequestRdmAccessFromDataTeam ? viewRecordsConfig.genericDataEmail : link.rek_link,
            openInNew: !mustRequestRdmAccessFromDataTeam,
        };

        const licence = getDownloadLicence(publication);

        return {
            index: index,
            link: (
                <ExternalLink
                    href={typeof window !== 'undefined' && variableLinkDetails.href}
                    title={variableLinkDetails.title}
                    id={`publication-${index}`}
                    openInNewIcon={variableLinkDetails.openInNew}
                    {...(isRDM && openAccessStatus.isOpenAccess && !!licence
                        ? {
                              onClick: e => {
                                  e.preventDefault();
                                  setState({
                                      isOpen: true,
                                      link: link.rek_link,
                                      licence: componentsLocale.components.attachedFiles.licenceConfirmation(licence),
                                  });
                              },
                          }
                        : {})}
                >
                    {variableLinkDetails.text}
                </ExternalLink>
            ),
            description: linkDescription,
            openAccessStatus: openAccessStatus,
        };
    };

    const txt = locale.viewRecord.sections.links;
    const pubmedCentralId =
        publication.fez_record_search_key_pubmed_central_id &&
        publication.fez_record_search_key_pubmed_central_id.rek_pubmed_central_id;
    const doi =
        publication.fez_record_search_key_doi &&
        publication.fez_record_search_key_doi.rek_doi &&
        getDOILink(publication.fez_record_search_key_doi.rek_doi)
            ? publication.fez_record_search_key_doi.rek_doi
            : null;
    const openAccessStatusId =
        publication.fez_record_search_key_oa_status && publication.fez_record_search_key_oa_status.rek_oa_status;
    const hasLinks = publication.fez_record_search_key_link && publication.fez_record_search_key_link.length > 0;
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
        publication.calculateOpenAccess && openAccessStatusId === openAccessConfig.OPEN_ACCESS_ID_DOI
            ? publication.calculateOpenAccess()
            : {};

    if (
        !(
            (publication.fez_record_search_key_link && publication.fez_record_search_key_link.length > 0) ||
            (publication.fez_record_search_key_pubmed_central_id &&
                publication.fez_record_search_key_pubmed_central_id.rek_pubmed_central_id) ||
            (publication.fez_record_search_key_doi && publication.fez_record_search_key_doi.rek_doi && !!doi) ||
            (publication.fez_record_search_key_oa_status &&
                publication.fez_record_search_key_oa_status.rek_oa_status ===
                    openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI)
        )
    ) {
        return null;
    }

    return (
        <Grid xs={12}>
            <ConfirmationBox
                confirmationBoxId="link-rdm-accept-licence"
                isOpen={state.isOpen}
                onAction={() => openRdmDownloadUrl(state.link)}
                onClose={() => setState({ isOpen: false, link: undefined })}
                locale={state.licence}
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
                {// if publication has a PubMedCentral Id - display link, should be always OA
                !!pubmedCentralId && (
                    <LinkRow linkId="rek-pubmed-central-id" {...getPMCLink(pubmedCentralId, pmcOpenAccessStatus)} />
                )}
                {// if publication has a DOI - display a link, should be OA or OA with a date
                !!doi && <LinkRow linkId="rek-doi" {...getDOILink(doi, doiOpenAccessStatus)} />}
                {// publication has OA status of "Link (no DOI)" and has no actual links of its own
                // then produce a google scholar link for the publication title
                openAccessStatusId === openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI &&
                    publication.fez_record_search_key_link &&
                    publication.fez_record_search_key_link.length === 0 && (
                        <LinkRow
                            linkId="rek-title"
                            {...getGoogleScholarLink(publication.rek_title, gcOpenAccessStatus)}
                        />
                    )}
                {hasLinks &&
                    publication.fez_record_search_key_link.map((item, index) => (
                        <LinkRow
                            linkId={`rek-link-${index}`}
                            {...getPublicationLink(item, index, isLinkNoDoi)}
                            key={index}
                        />
                    ))}
            </StandardCard>
        </Grid>
    );
};

Links.propTypes = {
    publication: PropTypes.object.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    openAccessStatus: PropTypes.shape({ isOpenAccess: PropTypes.bool }),
    link: PropTypes.shape({ rek_link: PropTypes.string }),
};

export default Links;
