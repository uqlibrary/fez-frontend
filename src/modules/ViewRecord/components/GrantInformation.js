import React, {Component} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';

export default class GrantInformation extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    renderGrantDetail = (grantAgency, grantId, grantText, order) => {
        const txt = locale.viewRecord.headings.default.grantInformation;
        return (
            <TableRow className="row" key={order}>
                <TableRowColumn className="header is-hidden-mobile">
                    <b>{txt.fez_record_search_key_grant_agency}</b>
                    {grantId && grantId.rek_grant_id.trim().length > 0 && ` (${txt.fez_record_search_key_grant_id})`}
                </TableRowColumn>
                <TableRowColumn className="data">
                    <b>{grantAgency.rek_grant_agency}</b>
                    {grantId && grantId.rek_grant_id.trim().length > 0 && ` (${grantId.rek_grant_id})`}
                    <span className="grantText">{grantText && grantText.rek_grant_text}</span>
                </TableRowColumn>
            </TableRow>
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
                {
                    fundingText &&
                    <p className="singleGrantText">{fundingText}</p>
                }
                <Table selectable={false} className="grantInformation vertical">
                    <TableBody displayRowCheckbox={false}>
                        {this.props.publication.fez_record_search_key_grant_agency && this.renderGrants(this.props.publication, !fundingText)}
                    </TableBody>
                </Table>
            </StandardCard>
        );
    }
}
