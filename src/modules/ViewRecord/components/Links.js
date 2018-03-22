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

    // Returns open, closed or an embargo date for non-DOI/PMC links
    oaStatus = () => {
        const recordOaStatus = this.props.publication.fez_record_search_key_oa_status && this.props.publication.fez_record_search_key_oa_status.rek_oa_status;
        const recordEmbargoDays = this.props.publication.fez_record_search_key_oa_embargo_days && this.props.publication.fez_record_search_key_oa_embargo_days.rek_oa_embargo_days;
        const currentDate = moment().format();
        const createdDate = this.props.publication.rek_created_date;
        const embargoDate = moment(moment(createdDate)).add(recordEmbargoDays, 'days').format();
        if(recordOaStatus !== 453694) {
            // if its not "Link (No DOI)" consider the pub links closed
            return 'closed';
        } else if(!recordEmbargoDays && recordOaStatus === 453694) {
            // If theres no embargo days specified and its "Link (No DOI)" consider pub links open
            return 'open';
        } else {
            // Otherwise, return an embargo date
            return embargoDate < currentDate ? 'open' : moment(embargoDate).format('Do MMMM YYYY');
        }
    };

    // Defines the icon element for each link based on the OA status
    getOaIcon = (status) => {
        const txt = locale.viewRecord.sections.links;
        const recordOaStatus = this.props.publication.fez_record_search_key_oa_status && this.props.publication.fez_record_search_key_oa_status.rek_oa_status;
        if(status === 'open') {
            return (
                <div className="fez-icon openAccess large"
                    title={txt.openAccessLabel.replace('[oa_status]',
                        openAccessIdLookup[recordOaStatus] || txt.labelNoOpenAccessLookup)}
                />
            );
        } else if (status === 'closed') {
            return (
                <div className="fez-icon openAccessClosed large"
                    title={txt.labelClosedAccess}
                />
            );
        } else if (!!status) {
            return (
                <div>
                    <span className="is-hidden-mobile is-hidden-tablet-only">
                        {this.oaStatus() && txt.embargoedUntil.replace('[embargo_date]', this.oaStatus())}
                    </span>
                    <div className="fez-icon openAccessEmbargoed large"
                        title={this.oaStatus() &&
                         (txt.openAccessEmbargoedLabel
                             .replace('[embargo_date]', this.oaStatus())
                             .replace('[oa_status]', openAccessIdLookup[recordOaStatus])) || txt.labelNoOpenAccessLookup}/>
                </div>
            );
        } else {
            return <div className="noOaIcon" />;
        }
    };

    // Generates an array of links to render
    // If there is a DOI, expect the OA status to be "DOI" - set the DOI to open access, pub links to closed access
    // Id there is a PMC ID, expect the OA status to be "PMC" - set the PMC to open access, DOI link to closed access and pub links open to embargo
    // If the OA status is "Link (No DOI)" (regardless of wether DOI is supplied or not) then all pub links are open to embargo
    allLinks = () => {
        const record = this.props.publication;
        const txt = locale.viewRecord.sections.links;
        const recordPubmedCentralId = record.fez_record_search_key_pubmed_central_id && record.fez_record_search_key_pubmed_central_id.rek_pubmed_central_id;
        const recordDoi = record.fez_record_search_key_doi && record.fez_record_search_key_doi.rek_doi;
        const recordOaStatus = record.fez_record_search_key_oa_status && record.fez_record_search_key_oa_status.rek_oa_status;
        const recordHasLinks = record.fez_record_search_key_link && record.fez_record_search_key_link.length > 0;
        const recordLinkDescription = (index) => record.fez_record_search_key_link_description && record.fez_record_search_key_link_description[index] && record.fez_record_search_key_link_description[index].rek_link_description || txt.linkMissingDescription;

        const links = [];
        if (recordPubmedCentralId) {
            links.push({
                link: <PubmedCentralLink pubmedCentralId={recordPubmedCentralId}/>,
                description: txt.pubmedCentralLinkDescription,
                icon: this.getOaIcon('open')
            });
        }
        if (recordDoi) {
            links.push({
                link: (<DoiLink DoiId={record.fez_record_search_key_doi.rek_doi}/>),
                description: openAccessIdLookup[recordOaStatus] || txt.labelNoOpenAccessLookup,
                icon: recordOaStatus === 453693 && !recordPubmedCentralId ? this.getOaIcon('open') : this.getOaIcon('closed')
            });
        }
        if (recordHasLinks) {
            // push all the other links in
            record.fez_record_search_key_link.map((item, index) => {
                links.push({
                    link: (
                        <ExternalLink href={item.rek_link} title={(recordLinkDescription(index)) || txt.linkMissingDescriptionTitle}>
                            {item.rek_link}
                        </ExternalLink>
                    ),
                    description: recordLinkDescription(index) || txt.linkMissingDescription,
                    icon: recordOaStatus !== 453693 ? this.getOaIcon(this.oaStatus()) : this.getOaIcon('closed')
                });
            });
        }
        return links;
    };

    render() {
        const record = this.props.publication;
        if(!record) return (<div className="links empty"/>);
        const txt = locale.viewRecord.sections.links;
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
                            {this.allLinks().map((item, index) => (
                                <TableRow key={index}>
                                    <TableRowColumn className="rowLink">{item.link}</TableRowColumn>
                                    <TableRowColumn className="rowDescription is-hidden-mobile">{item.description}</TableRowColumn>
                                    <TableRowColumn className="rowOA align-right">{item.icon}</TableRowColumn>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </StandardCard>
        );
    }
}
