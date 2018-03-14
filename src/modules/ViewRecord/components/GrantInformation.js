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

    renderRow = (heading, data) => {
        return (
            <TableRow className="tableRow">
                <TableRowColumn className="headingColumn">
                    {heading}
                </TableRowColumn>
                <TableRowColumn className="dataColumn">
                    {data}
                </TableRowColumn>
            </TableRow>
        );
    }

    renderGrantDetail = (grantAgency, grantAgencyId, grantId, grantText, order) => {
        return (
            <Table selectable={false} className="grantInformation" key={`grantInformation-${order}`}>
                <TableBody displayRowCheckbox={false}>
                    {
                        this.renderRow(locale.viewRecord.headings.default.grantInformation.fez_record_search_key_grant_agency, grantAgency.rek_grant_agency)
                    }
                    {
                        grantAgencyId &&
                        this.renderRow(locale.viewRecord.headings.default.grantInformation.fez_record_search_key_grant_agency_id, grantAgencyId.rek_grant_agency_id)
                    }
                    {
                        grantId &&
                        this.renderRow(locale.viewRecord.headings.default.grantInformation.fez_record_search_key_grant_id, grantId.rek_grant_id)
                    }
                    {
                        grantText &&
                        this.renderRow(locale.viewRecord.headings.default.grantInformation.fez_record_search_key_grant_text, grantText.rek_grant_text)
                    }
                </TableBody>
            </Table>
        );
    }

    searchByOrder = (grantData, orderSubkey, order) => {
        return grantData && grantData.filter(grantData=>grantData[orderSubkey] === order)[0];
    }

    renderGrants = (publication) => {
        const grants = [];
        const grantAgencies = publication.fez_record_search_key_grant_agency;
        const grantAgencyIds = publication.fez_record_search_key_grant_agency_id;
        const grantIds = publication.fez_record_search_key_grant_id;
        const grantTexts = publication.fez_record_search_key_grant_text;

        grantAgencies.sort((grantAgency1, grantAgency2) => (
            grantAgency1.rek_grant_agency_order - grantAgency2.rek_grant_agency_order
        )).map((grantAgency) => {
            const order = grantAgency.rek_grant_agency_order;
            const grantAgencyId = this.searchByOrder(grantAgencyIds, 'rek_grant_agency_id_order', order);
            const grantId = this.searchByOrder(grantIds, 'rek_grant_id_order', order);
            const grantText = this.searchByOrder(grantTexts, 'rek_grant_text_order', order);
            grants.push(this.renderGrantDetail(grantAgency, grantAgencyId, grantId, grantText, order));
        });
        return grants;
    }

    render() {
        return (
            <StandardCard title={locale.viewRecord.sections.grantInformation}>
                {this.props.publication.fez_record_search_key_grant_agency && this.renderGrants(this.props.publication)}
            </StandardCard>
        );
    }
}
