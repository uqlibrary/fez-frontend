import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

import { locale } from 'locale';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import OpenAccessIcon from 'modules/SharedComponents/Partials/OpenAccessIcon';
import * as Partials from './partials';
import Grid from '@mui/material/GridLegacy';

export const CitationCounts = ({ publication, hideViewFullStatisticsLink }) => {
    const theme = useTheme();
    const getTitle = title =>
        locale.components.publicationCitation.linkWillOpenInNewWindow.replace('[destination]', title);

    const txt = locale.components.publicationCitation.citationCounts;
    const { sources } = locale.global;

    const counts = {
        openalex: publication.hasOwnProperty('rek_openalex_citation_count')
            ? publication.rek_openalex_citation_count
            : null,
        wos: publication.hasOwnProperty('rek_thomson_citation_count') ? publication.rek_thomson_citation_count : null,
        scopus: publication.hasOwnProperty('rek_scopus_citation_count') ? publication.rek_scopus_citation_count : null,
        google: publication.hasOwnProperty('rek_gs_citation_count') ? publication.rek_gs_citation_count : null,
        altmetric: publication.hasOwnProperty('rek_altmetric_score') ? publication.rek_altmetric_score : null,
        dimensions: publication.hasOwnProperty('rek_dimensions_citation_count')
            ? publication.rek_dimensions_citation_count
            : null,
    };

    return (
        <Grid container spacing={0}>
            <Grid item xs={12} sm={'auto'}>
                {!!publication.fez_record_search_key_isi_loc &&
                    !!publication.fez_record_search_key_isi_loc.rek_isi_loc && (
                        <Partials.CitationCountView
                            source="wos"
                            count={counts.wos}
                            link={sources.wos.externalUrl.replace(
                                '[id]',
                                encodeURIComponent(publication.fez_record_search_key_isi_loc.rek_isi_loc),
                            )}
                            title={getTitle(sources.wos.title)}
                        />
                    )}
                {!!publication.fez_record_search_key_scopus_id &&
                    !!publication.fez_record_search_key_scopus_id.rek_scopus_id && (
                        <Partials.CitationCountView
                            source="scopus"
                            count={counts.scopus}
                            link={sources.scopus.externalUrl.replace(
                                '[id]',
                                encodeURIComponent(publication.fez_record_search_key_scopus_id.rek_scopus_id),
                            )}
                            title={getTitle(sources.scopus.title)}
                        />
                    )}
                {!!counts.altmetric && counts.altmetric > 0 && !!publication.rek_altmetric_id && (
                    <Partials.CitationCountView
                        source="altmetric"
                        count={counts.altmetric}
                        link={txt.altmetric.externalUrl.replace('[id]', publication.rek_altmetric_id)}
                        title={getTitle(txt.altmetric.title)}
                    />
                )}
                {!!publication.fez_record_search_key_dimensions_id &&
                    !!publication.fez_record_search_key_dimensions_id.rek_dimensions_id && (
                        <Partials.CitationCountView
                            source="dimensions"
                            count={counts.dimensions || 0}
                            link={txt.dimensions.externalUrl.replace(
                                '[id]',
                                encodeURIComponent(publication.fez_record_search_key_dimensions_id.rek_dimensions_id),
                            )}
                            title={getTitle(txt.dimensions.title)}
                        />
                    )}
                {!!publication.rek_pid && (
                    <Partials.CitationCountView
                        source="google"
                        count={counts.google}
                        link={txt.google.externalUrl.replace('[id]', encodeURI(publication.rek_title))}
                        title={getTitle(txt.google.title)}
                    />
                )}
                {!!publication.fez_record_search_key_openalex_id &&
                    !!publication.fez_record_search_key_openalex_id.rek_openalex_id && (
                        <Partials.CitationCountView
                            source="openalex"
                            count={counts.openalex}
                            link={sources.openalex.externalUrl.replace(
                                '[id]',
                                encodeURIComponent(publication.fez_record_search_key_openalex_id.rek_openalex_id),
                            )}
                            title={getTitle(sources.openalex.title)}
                        />
                    )}
                <OpenAccessIcon
                    {...(publication.calculateOpenAccess ? publication.calculateOpenAccess() : {})}
                    style={{ marginBottom: '-5px' }}
                />
            </Grid>
            <Grid item>
                {!!publication.rek_pid &&
                    (counts.wos !== null || counts.scopus !== null) &&
                    !hideViewFullStatisticsLink && (
                        <ExternalLink
                            id="full-statistics"
                            href={`https://app.library.uq.edu.au/#/authors/view/${publication.rek_pid}`}
                            title={publication.rek_title}
                            sx={{ ...theme.typography.caption }}
                        >
                            {txt.statsLabel}
                        </ExternalLink>
                    )}
            </Grid>
            <Grid item xs sx={{ display: { xs: 'none', sm: 'block' } }} />
        </Grid>
    );
};
CitationCounts.propTypes = {
    publication: PropTypes.object.isRequired,
    hideViewFullStatisticsLink: PropTypes.bool,
    theme: PropTypes.any,
};

export default React.memo(CitationCounts);
