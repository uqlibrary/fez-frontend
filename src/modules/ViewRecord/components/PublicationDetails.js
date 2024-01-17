import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import { default as componentLocale } from 'locale/components';
import { pathConfig } from 'config/pathConfig';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { Link } from 'react-router-dom';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export class PublicationDetails extends PureComponent {
    static propTypes = {
        publication: PropTypes.object.isRequired,
    };

    ViewRecordRow = ({ heading, data, rowId }) => (
        <Box sx={theme => ({ padding: { xs: `${theme.spacing(1)} 0`, sm: theme.spacing(1) } })}>
            <Grid
                container
                spacing={2}
                padding={0}
                sx={{ borderBottom: '1px solid', borderBottomColor: 'secondary.light' }}
                alignItems="flex-start"
            >
                <Grid xs={12} sm={3}>
                    <Typography variant="body2" component={'span'} data-testid={`${rowId}-label`}>
                        {heading}
                    </Typography>
                </Grid>
                <Grid xs={12} sm={9}>
                    <Typography variant="body2" component={'span'} data-testid={`${rowId}`}>
                        {data}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );

    render() {
        if (!this.props.publication.rek_display_type_lookup) {
            return null;
        }

        const headings = locale.viewRecord.headings.default.publicationDetails;

        // Some record types require a different header text (e.g. collections),
        // so attempt to get a new
        // header value from the publicationDetailsCustom object and if nothing
        // there, fallback to standard header
        const sectionTitle =
            locale.viewRecord.sections.publicationDetailsCustom[this.props.publication.rek_display_type_lookup] ??
            locale.viewRecord.sections.publicationDetails;

        // Similarly to above, if a Collection is being viewed we want the row title to read
        // 'Community' or 'Communities'. All other record types should continue to show 'Collections'.
        // Note in this implementation that Collections are the only record type requiring a different
        // row title, so here the call to get the header text is expected to be a function accepting
        // a boolean argument.
        const recordTypeHeading =
            headings.fez_record_search_key_ismemberof_custom[this.props.publication.rek_display_type_lookup]?.(
                this.props.publication.fez_record_search_key_ismemberof.length > 1,
            ) ?? headings.fez_record_search_key_ismemberof;

        return (
            <Grid xs={12}>
                <StandardCard title={sectionTitle}>
                    {this.props.publication.rek_display_type_lookup && (
                        <this.ViewRecordRow
                            heading={headings.rek_display_type}
                            data={this.props.publication.rek_display_type_lookup}
                            rowId="rek-display-type"
                        />
                    )}
                    {this.props.publication.rek_subtype && (
                        <this.ViewRecordRow
                            heading={headings.rek_subtype}
                            data={this.props.publication.rek_subtype}
                            rowId="rek-subtype"
                        />
                    )}
                    {this.props.publication.fez_record_search_key_content_indicator &&
                        this.props.publication.fez_record_search_key_content_indicator.length > 0 && (
                            <this.ViewRecordRow
                                heading={componentLocale.components.contentIndicators.label}
                                data={this.props.publication.fez_record_search_key_content_indicator.map(
                                    (item, index) => (
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
                                    ),
                                )}
                                rowId="rek-content-indicator"
                            />
                        )}
                    {this.props.publication.fez_record_search_key_ismemberof &&
                        this.props.publication.fez_record_search_key_ismemberof.length > 0 && (
                            <this.ViewRecordRow
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
                                        {this.props.publication.fez_record_search_key_ismemberof.map(
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
    }
}

export default PublicationDetails;
