import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import {pathConfig} from 'config/routes';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {Link} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
    header: {
        fontWeight: 400,
        [theme.breakpoints.down('xs')]: {
            fontSize: '0.975rem',
        },
        [theme.breakpoints.up('sm')]: {
            fontSize: '0.775rem',
            marginLeft: 16,
            fontWeight: 500
        }
    },
    data: {
        fontSize: '0.8rem'
    },
    gridRow: {
        padding: 8,
        borderBottom: `1px solid ${theme.palette.secondary.light}`,
        marginTop: 8
    }
});

export class PublicationDetails extends PureComponent {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        classes: PropTypes.object
    };

    ViewRecordRow = ({heading, data}) => (
        <Grid container spacing={16} className={this.props.classes.gridRow} alignItems="flex-start">
            <Grid item xs={12} sm={3}>
                <Typography variant="body2" classes={{root: this.props.classes.header}}>{heading}</Typography>
            </Grid>
            <Grid item xs={12} sm={9} className={this.props.classes.data}>{data}</Grid>
        </Grid>
    );

    render() {
        if (!this.props.publication.rek_display_type_lookup) {
            return null;
        }

        return (
            <StandardCard title={locale.viewRecord.sections.publicationDetails}>
                <Grid container direction="row">
                    {
                        this.props.publication.rek_display_type_lookup &&
                        <Grid item xs={12}>
                            <this.ViewRecordRow
                                heading={locale.viewRecord.headings.default.publicationDetails.rek_display_type}
                                data={this.props.publication.rek_display_type_lookup}
                            />
                        </Grid>
                    }
                    {
                        this.props.publication.rek_subtype &&
                        <Grid item xs={12}>
                            <this.ViewRecordRow
                                heading={locale.viewRecord.headings.default.publicationDetails.rek_subtype}
                                data={this.props.publication.rek_subtype}
                            />
                        </Grid>
                    }
                    {
                        this.props.publication.fez_record_search_key_ismemberof &&
                        this.props.publication.fez_record_search_key_ismemberof.length > 0 &&
                        <Grid item xs={12}>
                            <this.ViewRecordRow
                                heading={locale.viewRecord.headings.default.publicationDetails.fez_record_search_key_ismemberof}
                                data={(
                                    <ul>
                                        {
                                            this.props.publication.fez_record_search_key_ismemberof.map((collection, index)=>(
                                                collection.rek_ismemberof && collection.rek_ismemberof_lookup &&
                                                <li key={`collection-${index}`}>
                                                    <Link to={pathConfig.list.collection(collection.rek_ismemberof, collection.rek_ismemberof_lookup)}>{collection.rek_ismemberof_lookup}</Link>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                )}
                            />
                        </Grid>
                    }
                </Grid>
            </StandardCard>
        );
    }
}

export default withStyles(styles)(PublicationDetails);
