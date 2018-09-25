import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';

const styles = (theme) => ({
    body2: {
        fontWeight: 400,
        [theme.breakpoints.down('xs')]: {
            fontSize: '0.975rem',
        },
        [theme.breakpoints.up('sm')]: {
            fontSize: '0.775rem',
            marginLeft: 16,
            fontWeight: 500,
            lineHeight: '1.715em'
        }
    },
    body1: {
        [theme.breakpoints.down('xs')]: {
            fontSize: '0.975rem'
        },
        [theme.breakpoints.up('sm')]: {
            fontSize: '0.775rem'
        },
        lineHeight: '1.715em',
        marginLeft: 4
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
export class GrantInformation extends PureComponent {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        classes: PropTypes.object
    };

    GrantInformationCell = ({grantAgency, grantId, className}) => {
        return (
            <Grid container display="row" alignItems="center">
                <Grid item>
                    <Typography variant="body2" classes={{body2: this.props.classes.body2}} className={className}>
                        {grantAgency}
                    </Typography>
                </Grid>
                {
                    !!grantId &&
                    <Grid item>
                        <Typography variant="body1" classes={{body1: this.props.classes.body1}} className={className}>
                            {` (${grantId})`}
                        </Typography>
                    </Grid>
                }
            </Grid>
        );
    };

    renderGrantDetail = (grantAgency, grantId, grantText, order) => {
        const txt = locale.viewRecord.headings.default.grantInformation;
        return (
            <Grid container key={order} spacing={16} className={this.props.classes.gridRow} alignItems="flex-start">
                <Grid item xs={12} sm={3}>
                    <this.GrantInformationCell
                        grantAgency={txt.fez_record_search_key_grant_agency}
                        grantId={grantId && !!grantId.rek_grant_id && grantId.rek_grant_id.trim().length > 0 && txt.fez_record_search_key_grant_id}
                        className="header"
                    />
                </Grid>
                <Grid item xs={12} sm={9} className={this.props.classes.data}>
                    <this.GrantInformationCell
                        grantAgency={grantAgency.rek_grant_agency}
                        grantId={grantId && !!grantId.rek_grant_id && grantId.rek_grant_id.trim().length > 0 && grantId.rek_grant_id}
                        className={this.props.classes.data}
                    />
                    <Typography variant="body1">{grantText && grantText.rek_grant_text}</Typography>
                </Grid>
            </Grid>
        );
    }

    searchByOrder = (grantData, orderSubkey, order) => {
        return grantData && grantData.filter(grantData=>grantData[orderSubkey] === order)[0];
    }

    renderGrants = (publication, includeFundingText = true) => {
        const grantAgencies = publication.fez_record_search_key_grant_agency;
        const grantIds = publication.fez_record_search_key_grant_id;
        const grantTexts = publication.fez_record_search_key_grant_text;

        return grantAgencies.sort((grantAgency1, grantAgency2) => (
            grantAgency1.rek_grant_agency_order - grantAgency2.rek_grant_agency_order
        )).map((grantAgency) => {
            const order = grantAgency.rek_grant_agency_order;
            const grantId = this.searchByOrder(grantIds, 'rek_grant_id_order', order);
            const grantText = includeFundingText && this.searchByOrder(grantTexts, 'rek_grant_text_order', order);
            return this.renderGrantDetail(grantAgency, grantId, grantText, order);
        });
    }

    render() {
        if(!this.props.publication.fez_record_search_key_grant_agency
            || this.props.publication.fez_record_search_key_grant_agency.length === 0) {
            return null;
        }

        const fundingText = this.props.publication.fez_record_search_key_grant_text &&
            this.props.publication.fez_record_search_key_grant_text.length === 1 &&
            this.props.publication.fez_record_search_key_grant_text[0].rek_grant_text || null;

        return (
            <StandardCard title={locale.viewRecord.sections.grantInformation}>
                <Grid id="grantInformation" container direction="row">
                    <Grid item xs={12} className={this.props.classes.gridRow}>
                        {
                            fundingText &&
                            <Typography variant="body1">{fundingText}</Typography>
                        }
                    </Grid>
                    <Grid item xs={12}>
                        {this.props.publication.fez_record_search_key_grant_agency && this.renderGrants(this.props.publication, !fundingText)}
                    </Grid>
                </Grid>
            </StandardCard>
        );
    }
}

export default withStyles(styles)(GrantInformation);
