import React, {Component} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';

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
            <TableRow className="tableRow" key={order}>
                <TableRowColumn className="headingColumn">
                    <b>{txt.fez_record_search_key_grant_agency}</b>
                    {grantId && ' (' + txt.fez_record_search_key_grant_id + ')'}
                </TableRowColumn>
                <TableRowColumn className="dataColumn">
                    <b>{grantAgency.rek_grant_agency}</b>
                    {grantId && ' (' + grantId.rek_grant_id + ')'}
                    <div className="grantText">{grantText && grantText.rek_grant_text}</div>
                </TableRowColumn>
            </TableRow>
        );
    }

    searchByOrder = (grantData, orderSubkey, order) => {
        return grantData && grantData.filter(grantData=>grantData[orderSubkey] === order)[0];
    }

    renderGrants = (publication) => {
        const grants = [];
        const grantAgencies = publication.fez_record_search_key_grant_agency;
        const grantIds = publication.fez_record_search_key_grant_id;
        const grantTexts = publication.fez_record_search_key_grant_text;

        grantAgencies.sort((grantAgency1, grantAgency2) => (
            grantAgency1.rek_grant_agency_order - grantAgency2.rek_grant_agency_order
        )).map((grantAgency) => {
            const order = grantAgency.rek_grant_agency_order;
            const grantId = this.searchByOrder(grantIds, 'rek_grant_id_order', order);
            const grantText = this.searchByOrder(grantTexts, 'rek_grant_text_order', order);
            grants.push(this.renderGrantDetail(grantAgency, grantId, grantText, order));
        });
        return grants;
    }

    render() {
        if(!this.props.publication.fez_record_search_key_grant_agency
            || this.props.publication.fez_record_search_key_grant_agency.length === 0) {
            return null;
        }

        return (
            <StandardCard title={locale.viewRecord.sections.grantInformation}>
                <Table selectable={false} className="grantInformation">
                    <TableBody displayRowCheckbox={false}>
                        {this.props.publication.fez_record_search_key_grant_agency && this.renderGrants(this.props.publication)}
                    </TableBody>
                </Table>
            </StandardCard>
        );
    }
}
