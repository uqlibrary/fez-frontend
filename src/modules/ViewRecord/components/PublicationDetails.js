import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import { default as componentLocale } from 'locale/components';
import { pathConfig } from 'config/pathConfig';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    gridRow: {
        borderBottom: `1px solid ${theme.palette.secondary.light}`,
    },
    ul: {
        ...theme.typography.body2,
        listStyleType: 'none',
        padding: 0,
        margin: 0,
    },
    contentIndicator: {
        '& + &::before': {
            content: `"${componentLocale.components.contentIndicators.divider}"`,
        },
    },
    containerPadding: {
        padding: `${theme.spacing(1)}px 0`,
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(1),
        },
    },
});

export class PublicationDetailsClass extends PureComponent {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        classes: PropTypes.object,
    };

    ViewRecordRow = ({ heading, data, rowId }) => (
        <div className={this.props.classes.containerPadding}>
            <Grid container spacing={2} className={this.props.classes.gridRow} alignItems="flex-start">
                <Grid item xs={12} sm={3}>
                    <Typography
                        variant="body2"
                        component={'span'}
                        classes={{ root: this.props.classes.header }}
                        data-testid={`${rowId}-label`}
                    >
                        {heading}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={9} className={this.props.classes.data}>
                    <Typography variant="body2" component={'span'} data-testid={`${rowId}`}>
                        {data}
                    </Typography>
                </Grid>
            </Grid>
        </div>
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
            <Grid item xs={12}>
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
                                        <span
                                            key={index}
                                            data-testid={`rek-content-indicator-${index}`}
                                            className={this.props.classes.contentIndicator}
                                        >
                                            {item.rek_content_indicator_lookup}
                                        </span>
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
                                    <ul className={this.props.classes.ul}>
                                        {this.props.publication.fez_record_search_key_ismemberof.map(
                                            (collection, index) =>
                                                collection.rek_ismemberof &&
                                                collection.rek_ismemberof_lookup && (
                                                    <li
                                                        key={`collection-${index}`}
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
                                    </ul>
                                }
                                rowId="rek-ismemberof"
                            />
                        )}
                </StandardCard>
            </Grid>
        );
    }
}

const StyledPublicationDetailsClass = withStyles(styles, { withTheme: true })(PublicationDetailsClass);
const PublicationDetails = props => <StyledPublicationDetailsClass {...props} />;
export default PublicationDetails;
