import React, {Component} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import {Table, TableBody} from 'material-ui/Table';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import ViewRecordTableRow from './ViewRecordTableRow';

export default class GrantInformation extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    renderGrantDetail = (grantAgency, grantId, grantText, order) => {
        return (
            <Table selectable={false} className="grantInformation" key={`grantInformation-${order}`}>
                <TableBody displayRowCheckbox={false}>
                    {
                        <ViewRecordTableRow heading={locale.viewRecord.headings.default.grantInformation.fez_record_search_key_grant_agency} data={grantAgency.rek_grant_agency} />
                    }
                    {
                        grantId &&
                        <ViewRecordTableRow heading={locale.viewRecord.headings.default.grantInformation.fez_record_search_key_grant_id} data={grantId.rek_grant_id} />
                    }
                    {
                        grantText &&
                        <ViewRecordTableRow heading={locale.viewRecord.headings.default.grantInformation.fez_record_search_key_grant_text} data={grantText.rek_grant_text} />
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
        return (
            <StandardCard title={locale.viewRecord.sections.grantInformation}>
                {this.props.publication.fez_record_search_key_grant_agency && this.renderGrants(this.props.publication)}
            </StandardCard>
        );
    }
}
