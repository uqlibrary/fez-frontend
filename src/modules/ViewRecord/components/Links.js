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
        publication: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        return this.props !== nextProps;
    }

    render() {
        const record = this.props.publication;
        const txt = locale.viewRecord.sections.links;
        const embargoed = () => {
            if(!record.fez_record_search_key_oa_embargo_days ||
                record.fez_record_search_key_oa_embargo_days && record.fez_record_search_key_oa_embargo_days.rek_oa_embargo_days === 0 ) {
                return false;
            } else {
                // const currentDate = moment().add(7, 'days').utc(); // For testing embargo timeframes
                const currentDate = moment().utc();
                const embargoDate = moment(moment().format(record.rek_created_date))
                    .add(record.fez_record_search_key_oa_embargo_days.rek_oa_embargo_days, 'days').utc();
                return embargoDate < currentDate ? false : moment(embargoDate).format('Do MMMM YY');
            }
        };
        const allLinks = (record) => {
            const allLinks = [];
            if (record.fez_record_search_key_doi && record.fez_record_search_key_doi.rek_doi) {
                // push the DOI link in
                allLinks.push({
                    link: (<DoiLink DoiId={record.fez_record_search_key_doi.rek_doi}/>),
                    description: record.fez_record_search_key_oa_status && openAccessIdLookup[record.fez_record_search_key_oa_status.rek_oa_status],
                    oaStatus: embargoed()
                });
            }
            if (record.fez_record_search_key_pubmed_central_id && record.fez_record_search_key_pubmed_central_id.rek_pubmed_central_id) {
                // push the pubmed central link in
                allLinks.push({
                    link: <PubmedCentralLink
                        pubmedCentralId={record.fez_record_search_key_pubmed_central_id && record.fez_record_search_key_pubmed_central_id.rek_pubmed_central_id}/>,
                    description: txt.pubmedCentralLinkDescription,
                    oaStatus: true
                });
            }
            if (record.fez_record_search_key_link && record.fez_record_search_key_link.length > 0) {
                // push all the pub links in
                record.fez_record_search_key_link.map((item, index) => {
                    allLinks.push({
                        link: (<ExternalLink href={item.rek_link}
                            title={(record.fez_record_search_key_link_description &&
                             record.fez_record_search_key_link_description[index] &&
                             record.fez_record_search_key_link_description[index].rek_link_description) ||
                            txt.linkMissingDescriptionTitle}>{item.rek_link}</ExternalLink>),
                        description: record.fez_record_search_key_link_description &&
                        record.fez_record_search_key_link_description[index] &&
                        record.fez_record_search_key_link_description[index].rek_link_description ||
                        txt.linkMissingDescription,
                        oaStatus: embargoed()
                    });
                });
            }
            return allLinks;
        };
        if(!record || !allLinks(record)) return (<div className="empty"/>);
        return (
            <StandardCard title={txt.title}>
                <div className="viewRecordLinks">
                    <Table selectable={false} className="links">
                        <TableHeader adjustForCheckbox={false} displaySelectAll={false} className="tableHeader">
                            <TableRow>
                                <TableHeaderColumn className="rowLink">{txt.headerTitles.link}</TableHeaderColumn>
                                <TableHeaderColumn className="rowDescription is-hidden-mobile">{txt.headerTitles.description}</TableHeaderColumn>
                                <TableHeaderColumn className="rowOA align-right">{txt.headerTitles.oaStatus}</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false} className="tableData">
                            {allLinks(record).map((item, index) => (
                                <TableRow key={index}>
                                    <TableRowColumn className="rowLink">
                                        {item.link}
                                    </TableRowColumn>
                                    <TableRowColumn className="rowDescription is-hidden-mobile">
                                        {item.description}
                                    </TableRowColumn>
                                    <TableRowColumn className="rowOA align-right">
                                        {embargoed() === false ?
                                            <div className="fez-icon openAccess large"
                                                title={txt.openAccessLabel.replace('[oa_status]',
                                                    record.fez_record_search_key_oa_status &&
                                                    record.fez_record_search_key_oa_status.rek_oa_status &&
                                                    openAccessIdLookup[record.fez_record_search_key_oa_status.rek_oa_status] ||
                                                    txt.labelNoOpenAccessLookup)}/>
                                            :
                                            <div>
                                                <span className="is-hidden-mobile is-hidden-tablet-only">
                                                    {txt.embargoedUntil.replace('[embargo_date]', embargoed())}
                                                </span>
                                                <div className="fez-icon openAccessLocked large"
                                                    title={txt.openAccessLockedLabel
                                                        .replace('[embargo_date]', embargoed())
                                                        .replace('[oa_status]', record.fez_record_search_key_oa_status &&
                                                        record.fez_record_search_key_oa_status.rek_oa_status &&
                                                        openAccessIdLookup[record.fez_record_search_key_oa_status.rek_oa_status] ||
                                                        txt.labelNoOpenAccessLockedLookup)}/>
                                            </div>
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
