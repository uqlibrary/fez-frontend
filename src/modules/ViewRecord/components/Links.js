import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {PubmedCentralLink} from 'modules/SharedComponents/PubmedCentralLink';
import {DoiLink} from 'modules/SharedComponents/DoiLink';
import {ExternalLink} from 'modules/SharedComponents/ExternalLink';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {locale} from 'locale';
import {OPEN_ACCESS_ID_DOI, OPEN_ACCESS_ID_LINK_NO_DOI, openAccessIdLookup} from 'config/general';
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

    // Returns open, closed or an embargo date for non-DOI/PMC/GoogleScholar links
    publicationLinksOpenAccessStatus = (
        oaStatus = this.props.publication.fez_record_search_key_oa_status && this.props.publication.fez_record_search_key_oa_status.rek_oa_status,
        embargoDays = this.props.publication.fez_record_search_key_oa_embargo_days && this.props.publication.fez_record_search_key_oa_embargo_days.rek_oa_embargo_days,
        createdDate = this.props.publication.rek_created_date) => {
        if(oaStatus !== OPEN_ACCESS_ID_LINK_NO_DOI) {
            // if its not "Link (No DOI)" consider the pub links closed
            return {openAccess: false, recordOaStatus: oaStatus,  embargoDate: null};
        } else if(!embargoDays && oaStatus === OPEN_ACCESS_ID_LINK_NO_DOI) {
            // If theres no embargo days specified and its "Link (No DOI)" consider publication links open
            return {openAccess: true, recordOaStatus: oaStatus, embargoDate: null};
        } else {
            // Otherwise, return an embargo date
            const currentDate = moment().format();
            const embargoDate = moment(moment(createdDate)).add(embargoDays, 'days').format();
            return embargoDate < currentDate ?
                {openAccess: true, recordOaStatus: oaStatus, embargoDate: null} :
                {openAccess: true, recordOaStatus: oaStatus, embargoDate: moment(embargoDate).format('Do MMMM YYYY')};
        }
    };

    // Returns the icon element based on status
    // {openAccess: bool, recordOaStatus: int, embargoDate: null || 'date'}
    getOaIcon = (status = {openAccess: false, recordOaStatus: null, embargoDate: null}) => {
        const txt = locale.viewRecord.sections.links;
        if(status.openAccess) {
            return (
                <div className="fez-icon openAccess large"
                    title={status.recordOaStatus !== OPEN_ACCESS_ID_LINK_NO_DOI ?
                        txt.openAccessLabel.replace('[oa_status]', openAccessIdLookup[status.recordOaStatus]) :
                        txt.labelOpenAccessNoStatus
                    }
                />
            );
        } else if (!status.openAccess) {
            return <div className="openAccessClosed noOaIcon" />;
        } else if (!!status) {
            return (
                <div>
                    <span className="is-hidden-mobile is-hidden-tablet-only">
                        {status && txt.embargoedUntil.replace('[embargo_date]', status)}
                    </span>
                    <div className="fez-icon openAccessEmbargoed large"
                        title={status &&
                         (txt.openAccessEmbargoedLabel
                             .replace('[embargo_date]', status)
                             .replace('[oa_status]', openAccessIdLookup[status]))}/>
                </div>
            );
        } else {
            return <div className="noOaIcon" />;
        }
    };

    // Generates an array of links to render
    // If there is a DOI, expect the OA status to be "DOI" - set the DOI to open access, pub links to closed access
    // Id there is a PMC ID, expect the OA status to be "PMC" - set the PMC to open access, DOI link to closed access and pub links open to embargo
    // If the OA status is "Link (No DOI)" (regardless of wether DOI is supplied or not) then all pub links are open to embargo and create a google scholar search link
    allLinks = (record) => {
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
                link: (<DoiLink DoiId={recordDoi}/>),
                description: openAccessIdLookup[recordOaStatus] || txt.labelNoOpenAccessLookup,
                icon: recordOaStatus === OPEN_ACCESS_ID_DOI && !recordPubmedCentralId ? this.getOaIcon('open') : this.getOaIcon('closed')
            });
        }
        if(recordOaStatus === OPEN_ACCESS_ID_LINK_NO_DOI) {
            // Has OA status of "Link (no DOI)" then produce a google scholar link for the publication title
            links.push({
                link: (<ExternalLink
                    href={txt.googleScholar.linkPrefix.replace('[title]', record.rek_title)}
                    title={txt.googleScholar.linkDescription}>
                    {txt.googleScholar.linkPrefix.replace('[title]', record.rek_title).replace('%22', '"')}
                </ExternalLink>),
                description: txt.googleScholar.linkDescription,
                icon: this.getOaIcon('open')
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
                    icon: recordOaStatus !== OPEN_ACCESS_ID_DOI ? this.getOaIcon(this.publicationLinksOpenAccessStatus()) : this.getOaIcon('closed')
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
                            {this.allLinks(record).map((item, index) => (
                                <TableRow key={index}>
                                    <TableRowColumn className="rowLink">{item.link}</TableRowColumn>
                                    <TableRowColumn className="rowDescription is-hidden-mobile" title={item.description}>{item.description}</TableRowColumn>
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
