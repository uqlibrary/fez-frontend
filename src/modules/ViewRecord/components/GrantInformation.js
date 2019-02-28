import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {ORG_TYPES_LOOKUP, ORG_TYPE_NOT_SET} from 'config/general';

const styles = (theme) => ({
    gridRow: {
        borderBottom: `1px solid ${theme.palette.secondary.light}`,
    }
});
export class GrantInformationClass extends PureComponent {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        classes: PropTypes.object
    };

    GrantInformationCell = ({grantAgencyName, grantId, className}) => {
        return (
            <Grid container display="row" alignItems="center">
                <Grid item>
                    <Typography variant="body2" className={className}>
                        {grantAgencyName}
                    </Typography>
                </Grid>
                {
                    !!grantId &&
                    <Grid item>
                        <Typography variant="body2" className={className}>
                            {` (${grantId})`}
                        </Typography>
                    </Grid>
                }
            </Grid>
        );
    };

    renderGrantDetail = (grantAgencyName, grantId, grantText, order, index) => {
        const txt = locale.viewRecord.headings.default.grantInformation;
        return (
            <div style={{padding: 8}} key={index}>
                <Grid container spacing={16} key={order} className={this.props.classes.gridRow} alignItems="flex-start">
                    <Grid item xs={12} sm={3}>
                        <this.GrantInformationCell
                            grantAgencyName={txt.fez_record_search_key_grant_agency}
                            grantId={grantId && !!grantId.rek_grant_id && grantId.rek_grant_id.trim().length > 0 && txt.fez_record_search_key_grant_id}
                            className="header"
                        />
                    </Grid>
                    <Grid item xs={12} sm={9} className={this.props.classes.data}>
                        <this.GrantInformationCell
                            grantAgencyName={grantAgencyName.rek_grant_agency}
                            grantId={grantId && !!grantId.rek_grant_id && grantId.rek_grant_id.trim().length > 0 && grantId.rek_grant_id !== ORG_TYPES_LOOKUP[ORG_TYPE_NOT_SET]  && grantId.rek_grant_id}
                            className={this.props.classes.data}
                        />
                        <Typography variant="body2">{grantText && grantText.rek_grant_text}</Typography>
                    </Grid>
                </Grid>
            </div>
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
        )).map((grantAgencyName, index) => {
            const order = grantAgencyName.rek_grant_agency_order;
            const grantId = this.searchByOrder(grantIds, 'rek_grant_id_order', order);
            const grantText = includeFundingText && this.searchByOrder(grantTexts, 'rek_grant_text_order', order);
            return this.renderGrantDetail(grantAgencyName, grantId, grantText, order, index);
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
            <Grid item xs={12}>
                <StandardCard title={locale.viewRecord.sections.grantInformation}>
                    {
                        fundingText &&
                        <Typography id="grantInformation" variant="body2" gutterBottom>{fundingText}</Typography>
                    }
                    {
                        this.props.publication.fez_record_search_key_grant_agency &&
                        this.renderGrants(this.props.publication, !fundingText)
                    }
                </StandardCard>
            </Grid>
        );
    }
}

const StyledGrantInformation = withStyles(styles, {withTheme: true})(GrantInformationClass);
const GrantInformation = (props) => <StyledGrantInformation {...props}/>;
export default GrantInformation;
