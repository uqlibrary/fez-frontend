import React from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import { default as componentLocale } from 'locale/components';
import { pathConfig } from 'config/pathConfig';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { Link } from 'react-router';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const PublicationDetails = ({ publication }) => {
    const ViewRecordRow = ({ heading, data, rowId }) => (
        <Box
            sx={theme => ({
                padding: { xs: `${theme.spacing(1)} 0`, sm: theme.spacing(1) },
                borderBottom: '1px solid',
                borderBottomColor: 'secondary.light',
            })}
        >
            <Grid
                container
                spacing={2}
                sx={{
                    padding: 0,
                    alignItems: 'flex-start',
                }}
            >
                <Grid
                    size={{
                        xs: 12,
                        sm: 3,
                    }}
                >
                    <Typography variant="body2" component={'span'} data-testid={`${rowId}-label`}>
                        {heading}
                    </Typography>
                </Grid>
                <Grid
                    size={{
                        xs: 12,
                        sm: 9,
                    }}
                >
                    <Typography variant="body2" component={'span'} data-testid={`${rowId}`}>
                        {data}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
    ViewRecordRow.propTypes = {
        heading: PropTypes.string,
        data: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
        rowId: PropTypes.string,
    };

    if (!publication.rek_display_type_lookup) {
        return null;
    }

    const headings = locale.viewRecord.headings.default.publicationDetails;

    // Some record types require a different header text (e.g. collections),
    // so attempt to get a new
    // header value from the publicationDetailsCustom object and if nothing
    // there, fallback to standard header
    const sectionTitle =
        locale.viewRecord.sections.publicationDetailsCustom[publication.rek_display_type_lookup] ??
        locale.viewRecord.sections.publicationDetails;

    // Similarly to above, if a Collection is being viewed we want the row title to read
    // 'Community' or 'Communities'. All other record types should continue to show 'Collections'.
    // Note in this implementation that Collections are the only record type requiring a different
    // row title, so here the call to get the header text is expected to be a function accepting
    // a boolean argument.
    const recordTypeHeading =
        headings.fez_record_search_key_ismemberof_custom[publication.rek_display_type_lookup]?.(
            publication.fez_record_search_key_ismemberof.length > 1,
        ) ?? headings.fez_record_search_key_ismemberof;

    return (
        <Grid size={12}>
            <StandardCard title={sectionTitle}>
                {publication.rek_display_type_lookup && (
                    <ViewRecordRow
                        heading={headings.rek_display_type}
                        data={publication.rek_display_type_lookup}
                        rowId="rek-display-type"
                    />
                )}
                {publication.rek_subtype && (
                    <ViewRecordRow heading={headings.rek_subtype} data={publication.rek_subtype} rowId="rek-subtype" />
                )}
                {publication.fez_record_search_key_content_indicator &&
                    publication.fez_record_search_key_content_indicator.length > 0 && (
                        <ViewRecordRow
                            heading={componentLocale.components.contentIndicators.label}
                            data={publication.fez_record_search_key_content_indicator.map((item, index) => (
                                <Box
                                    component={'span'}
                                    key={index}
                                    data-analyticsid={`rek-content-indicator-${index}`}
                                    data-testid={`rek-content-indicator-${index}`}
                                    sx={{
                                        '& + &::before': {
                                            content: `"${componentLocale.components.contentIndicators.divider}"`,
                                        },
                                    }}
                                >
                                    {item.rek_content_indicator_lookup}
                                </Box>
                            ))}
                            rowId="rek-content-indicator"
                        />
                    )}
                {publication.fez_record_search_key_ismemberof &&
                    publication.fez_record_search_key_ismemberof.length > 0 && (
                        <ViewRecordRow
                            heading={recordTypeHeading}
                            data={
                                <Box
                                    component={'ul'}
                                    sx={theme => ({
                                        ...theme.typography.body2,
                                        listStyleType: 'none',
                                        padding: 0,
                                        margin: 0,
                                    })}
                                >
                                    {publication.fez_record_search_key_ismemberof.map(
                                        (collection, index) =>
                                            collection.rek_ismemberof &&
                                            collection.rek_ismemberof_lookup && (
                                                <li
                                                    key={`collection-${index}`}
                                                    data-analyticsid={`rek-ismemberof-${index}`}
                                                    data-testid={`rek-ismemberof-${index}`}
                                                >
                                                    <Link
                                                        to={pathConfig.list.collection(
                                                            collection.rek_ismemberof,
                                                            collection.rek_ismemberof_lookup,
                                                        )}
                                                    >
                                                        {collection.rek_ismemberof_lookup}
                                                    </Link>
                                                </li>
                                            ),
                                    )}
                                </Box>
                            }
                            rowId="rek-ismemberof"
                        />
                    )}
            </StandardCard>
        </Grid>
    );
};

PublicationDetails.propTypes = {
    publication: PropTypes.object.isRequired,
};

export default PublicationDetails;
