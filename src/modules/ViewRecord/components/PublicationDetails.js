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

        return (
            <Grid item xs={12}>
                <StandardCard title={locale.viewRecord.sections.publicationDetails}>
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
                                heading={headings.fez_record_search_key_ismemberof}
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
