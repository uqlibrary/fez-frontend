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
        if(!record) return (<div className="links empty"/>);
        const txt = locale.viewRecord.sections.links;

        const isEmbargoed = () => {
            if(!record.fez_record_search_key_oa_embargo_days ||
                record.fez_record_search_key_oa_embargo_days && record.fez_record_search_key_oa_embargo_days.rek_oa_embargo_days === 0 ) {
                return false;
            } else {
                console.log('has embargo of', record.fez_record_search_key_oa_embargo_days.rek_oa_embargo_days);
                const currentDate = moment().format();
                const embargoDate = moment(moment(record.rek_created_date))
                    .add(record.fez_record_search_key_oa_embargo_days.rek_oa_embargo_days, 'days').format();
                return embargoDate < currentDate ? false : moment(embargoDate).format('Do MMMM YYYY');
            }
        };
        const oaIcon = () => {
            if(!isEmbargoed()) {
                // Open access and no embargo
                return (<div className="fez-icon openAccess large"
                    title={txt.openAccessLabel.replace('[oa_status]',
                        record.fez_record_search_key_oa_status && record.fez_record_search_key_oa_status.rek_oa_status &&
                        openAccessIdLookup[record.fez_record_search_key_oa_status.rek_oa_status] ||
                        txt.labelNoOpenAccessLookup)}/>);
            } else {
                // Open access but under an embargo date
                return (<div>
                    <span className="is-hidden-mobile is-hidden-tablet-only">
                        {txt.embargoedUntil.replace('[embargo_date]', isEmbargoed())}
                    </span>
                    <div className="fez-icon openAccessLocked large"
                        title={txt.openAccessLockedLabel
                            .replace('[embargo_date]', isEmbargoed())
                            .replace('[oa_status]', record.fez_record_search_key_oa_status && record.fez_record_search_key_oa_status.rek_oa_status &&
                            openAccessIdLookup[record.fez_record_search_key_oa_status.rek_oa_status] ||
                            txt.labelNoOpenAccessLockedLookup)}/>
                </div>);
            }
        };
        const allLinks = () => {
            const allLinks = [];
            if (record.fez_record_search_key_doi && record.fez_record_search_key_doi.rek_doi) {
                // push the DOI link in
                allLinks.push({
                    link: (<DoiLink DoiId={record.fez_record_search_key_doi.rek_doi}/>),
                    description: record.fez_record_search_key_oa_status && openAccessIdLookup[record.fez_record_search_key_oa_status.rek_oa_status],
                    oaStatus: oaIcon(isEmbargoed())
                });
            }
            if (record.fez_record_search_key_pubmed_central_id && record.fez_record_search_key_pubmed_central_id.rek_pubmed_central_id) {
                // push the pubmed central link in
                allLinks.push({
                    link: <PubmedCentralLink pubmedCentralId={record.fez_record_search_key_pubmed_central_id &&
                    record.fez_record_search_key_pubmed_central_id.rek_pubmed_central_id}/>,
                    description: txt.pubmedCentralLinkDescription,
                    oaStatus: oaIcon(isEmbargoed()) // PMC always has open access icon?
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
                        oaStatus: oaIcon(isEmbargoed())
                    });
                });
            }
            return allLinks;
        };

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
                            {allLinks().map((item, index) => (
                                <TableRow key={index}>
                                    <TableRowColumn className="rowLink">{item.link}</TableRowColumn>
                                    <TableRowColumn className="rowDescription is-hidden-mobile">{item.description}</TableRowColumn>
                                    <TableRowColumn className="rowOA align-right">{item.oaStatus}</TableRowColumn>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </StandardCard>
        );
    }
}
