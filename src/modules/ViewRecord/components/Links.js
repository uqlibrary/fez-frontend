import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {PubmedCentralLink} from 'modules/SharedComponents/PubmedCentralLink';
import {DoiLink} from 'modules/SharedComponents/DoiLink';
import {ExternalLink} from 'modules/SharedComponents/ExternalLink';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {locale} from 'locale';
import {openAccessIdLookup} from 'config/general';
import moment from 'moment';

export default class ViewRecordLinks extends PureComponent {
    static propTypes = {
        recordToView: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        return this.props !== nextProps;
    }

    render() {
        const record = this.props.recordToView;
        const txt = locale.viewRecord.sections.links;
        const openAccessStatus = () => {
            if(!record.fez_record_search_key_oa_embargo_days) {
                return true;
            } else {
                const currentDate = moment().utc();
                const embargoDate = moment(moment().format(record.rek_created_date))
                    .add(record.fez_record_search_key_oa_embargo_days.rek_embargo_days, 'days').utc();
                return (embargoDate < currentDate);
            }
        };
        const showPMC = () => {
            return (record && record.fez_record_search_key_pubmed_central_id && record.fez_record_search_key_pubmed_central_id.rek_pubmed_central_id);
        };
        if(!record) return (<div className="empty"/>);
        return (
            <StandardCard title={txt.title}>
                <div className="viewRecordLinks">
                    <Table selectable={false} className="links">
                        <TableHeader adjustForCheckbox={false} displaySelectAll={false} className="tableHeader">
                            <TableRow>
                                <TableHeaderColumn className="rowLink">Link (will open in a new window)</TableHeaderColumn>
                                <TableHeaderColumn className="rowDescription is-hidden-mobile">Description</TableHeaderColumn>
                                <TableHeaderColumn className="rowOA align-right">&nbsp;</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false} className="tableData">
                            {/* Generate DOI link if an ID exists */}
                            {
                                record.fez_record_search_key_doi &&
                                record.fez_record_search_key_doi.rek_doi &&
                                <TableRow className="tableRow">
                                    <TableRowColumn className="rowLink">
                                        <DoiLink DoiId={record.fez_record_search_key_doi.rek_doi}/>
                                    </TableRowColumn>
                                    <TableRowColumn className="rowDescription is-hidden-mobile">
                                        {record.fez_record_search_key_oa_status && openAccessIdLookup[record.fez_record_search_key_oa_status.rek_oa_status]}
                                    </TableRowColumn>
                                    <TableRowColumn className="rowOA align-right">
                                        {
                                            openAccessStatus() &&
                                            <div className="fez-icon openAccess large"
                                                title={txt.openAccessLabel.replace('[oa_status]', record.fez_record_search_key_oa_status && openAccessIdLookup[record.fez_record_search_key_oa_status.rek_oa_status])}
                                            />
                                        }
                                    </TableRowColumn>
                                </TableRow>
                            }
                            {/* Generate PubMed Central link if an ID exists */}
                            {
                                showPMC() &&
                                <TableRow>
                                    <TableRowColumn className="rowLink">
                                        <PubmedCentralLink pubmedCentralId={record.fez_record_search_key_pubmed_central_id && record.fez_record_search_key_pubmed_central_id.rek_pubmed_central_id}/>
                                    </TableRowColumn>
                                    <TableRowColumn className="rowDescription is-hidden-mobile">Pubmed Central link</TableRowColumn>
                                    <TableRowColumn className="rowOA align-right">
                                        <div className="fez-icon openAccess large" />
                                    </TableRowColumn>
                                </TableRow>
                            }
                            {/* Generate all other links */}
                            {
                                record.fez_record_search_key_link &&
                                record.fez_record_search_key_link.length > 0 &&
                                record.fez_record_search_key_link.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableRowColumn className="rowLink">
                                            <ExternalLink href={item.rek_link}
                                                title={record.fez_record_search_key_link_description[index].rek_link_description || txt.linkMissingDescriptionTitle}
                                            >
                                                {item.rek_link}
                                            </ExternalLink>
                                        </TableRowColumn>
                                        <TableRowColumn className="rowDescription is-hidden-mobile">
                                            {record.fez_record_search_key_link_description[index].rek_link_description || txt.linkMissingDescription}
                                        </TableRowColumn>
                                        <TableRowColumn className="rowOA align-right">
                                            {
                                                openAccessStatus() &&
                                                <div className="fez-icon openAccess large"
                                                    title={txt.openAccessLabel.replace('[oa_status]', openAccessIdLookup[record.fez_record_search_key_oa_status.rek_oa_status])}/>
                                            }
                                        </TableRowColumn>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </div>
            </StandardCard>
        );
    }
}
