import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {PubmedCentralLink} from 'modules/SharedComponents/PubmedCentralLink';
import DoiCitationView from 'modules/SharedComponents/PublicationCitation/components/citations/partials/DoiCitationView';
// import {DoiLink} from 'modules/SharedComponents/DoiLink';
import {ExternalLink} from 'modules/SharedComponents/ExternalLink';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {locale} from 'locale';
import {OPEN_ACCESS_ID_LINK_NO_DOI, OPEN_ACCESS_ID_DOI, openAccessIdLookup} from 'config/general';
import moment from 'moment';

export default class ViewRecordLinks extends PureComponent {
    static propTypes = {
        publication: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    // Returns an object {openAccess: bool, recordOaStatus: int, embargoDate: date || null}
    publicationLinkOpenAccessStatus = (recordOaStatus, recordEmbargoDays, recordPublishedDate) => {
        if(recordOaStatus !== OPEN_ACCESS_ID_LINK_NO_DOI) {
            return {openAccess: false, recordOaStatus: recordOaStatus,  embargoDate: null};
        } else if(!recordEmbargoDays && recordOaStatus === OPEN_ACCESS_ID_LINK_NO_DOI) {
            return {openAccess: true, recordOaStatus: recordOaStatus, embargoDate: null};
        } else {
            const currentDate = moment().format();
            const embargoDate = moment(moment(recordPublishedDate)).add(recordEmbargoDays, 'days').format();
            return embargoDate < currentDate ?
                {openAccess: true, recordOaStatus: recordOaStatus, embargoDate: null} :
                {openAccess: false, recordOaStatus: recordOaStatus, embargoDate: moment(embargoDate).format('Do MMMM YYYY')};
        }
    };

    // Returns the icon element based on a specified object
    // {openAccess: bool, recordOaStatus: int, embargoDate: date || null} or from publicationLinkOpenAccessStatus()
    getOaIcon = (status) => {
        const recordOaStatus = this.props.publication.fez_record_search_key_oa_status
            && this.props.publication.fez_record_search_key_oa_status.rek_oa_status;
        const txt = locale.viewRecord.sections.links;
        if(status.openAccess && !status.embargoDate) {
            return (
                <div className="fez-icon openAccess large"
                    title={recordOaStatus !== OPEN_ACCESS_ID_LINK_NO_DOI ?
                        txt.openAccessLabel.replace('[oa_status]', openAccessIdLookup[recordOaStatus])
                        : txt.labelOpenAccessNoStatus
                    }
                />
            );
        } else if (!status.openAccess && status.embargoDate) {
            return (
                <div>
                    <span className="is-hidden-mobile is-hidden-tablet-only">
                        {txt.embargoedUntil.replace('[embargo_date]', status.embargoDate)}
                    </span>
                    <div className="fez-icon openAccessEmbargoed large"
                        title={(txt.openAccessEmbargoedLabel
                            .replace('[embargo_date]', status.embargoDate)
                            .replace('[oa_status]', openAccessIdLookup[recordOaStatus]))}/>
                </div>
            );
        } else {
            return <div className="openAccessClosed noOaIcon" />;
        }
    };

    // Returns an object with link, description and icon to the DOI
    getDOILink = (recordDoi, recordOaStatus, recordPubmedCentralId) => {
        return {
            link: (<DoiCitationView doi={recordDoi} />),
            description: openAccessIdLookup[recordOaStatus]
            || locale.viewRecord.sections.links.labelNoOpenAccessLookup,
            icon: recordOaStatus === OPEN_ACCESS_ID_DOI && !recordPubmedCentralId ?
                this.getOaIcon({openAccess: true, embargoDate: null}) :
                this.getOaIcon({openAccess: false, embargoDate: null})
        };
    };

    // Returns an object with link, description and icon to the PMC ID
    getPMCLink = (recordPubmedCentralId) => {
        return {
            link: <PubmedCentralLink pubmedCentralId={recordPubmedCentralId}/>,
            description: locale.viewRecord.sections.links.pubmedCentralLinkDescription,
            icon: this.getOaIcon({openAccess: true, embargoed: false})
        };
    };

    // Returns an object with link to google scholar searching for the title
    getGoogleScholarLink = (title) => {
        return {
            link: (<ExternalLink
                href={locale.viewRecord.sections.links.googleScholar.linkPrefix.replace('[title]', title)}
                title={locale.viewRecord.sections.links.googleScholar.linkDescription}>
                {locale.viewRecord.sections.links.googleScholar.linkPrefix.replace('[title]', title).replace('%22', '"')}
            </ExternalLink>),
            description: locale.viewRecord.sections.links.googleScholar.linkDescription,
            icon: this.getOaIcon({openAccess: true, embargoed: false})
        };
    };

    // Returns an object with link, description and icon for all links listed in the publication.
    getPublicationLink = (item, index, recordOaStatus, embargoDays, publishedDate) => {
        const itemDescription = this.props.publication.fez_record_search_key_link_description
            && this.props.publication.fez_record_search_key_link_description[index]
            && this.props.publication.fez_record_search_key_link_description[index].rek_link_description;
        return {
            link: (
                <ExternalLink href={item.rek_link}
                    title={itemDescription || locale.viewRecord.sections.links.linkMissingDescriptionTitle}
                >
                    {item.rek_link}
                </ExternalLink>
            ),
            description: itemDescription || locale.viewRecord.sections.links.linkMissingDescription,
            icon: recordOaStatus !== OPEN_ACCESS_ID_DOI ?
                this.getOaIcon(this.publicationLinkOpenAccessStatus(recordOaStatus, embargoDays, publishedDate)) :
                this.getOaIcon({openAccess: false, embargoed: false})
        };
    };

    // Generates an array of links to render
    allLinks = (record) => {
        const recordPubmedCentralId = record.fez_record_search_key_pubmed_central_id
            && record.fez_record_search_key_pubmed_central_id.rek_pubmed_central_id;
        const recordDoi = record.fez_record_search_key_doi
            && record.fez_record_search_key_doi.rek_doi;
        const recordOaStatus = record.fez_record_search_key_oa_status
            && record.fez_record_search_key_oa_status.rek_oa_status;
        const recordHasPublicationLinks = record.fez_record_search_key_link
            && record.fez_record_search_key_link.length > 0;
        const embargoDays = record.fez_record_search_key_oa_embargo_days
            && record.fez_record_search_key_oa_embargo_days.rek_oa_embargo_days
            || 0;
        const publishedDate = record.rek_date;
        const links = [];

        // Has a PubMed Central ID
        if (recordPubmedCentralId) {
            links.push(this.getPMCLink(recordPubmedCentralId));
        }

        // Has a DOI
        if (recordDoi) {
            links.push(this.getDOILink(recordDoi, recordOaStatus, recordPubmedCentralId));
        }

        // Has OA status of "Link (no DOI)" then produce a google scholar link for the publication title
        if(recordOaStatus === OPEN_ACCESS_ID_LINK_NO_DOI) {
            links.push(this.getGoogleScholarLink(record.rek_title));
        }

        // push all the other links in
        if (recordHasPublicationLinks) {
            record.fez_record_search_key_link.map((item, index) => {
                links.push(this.getPublicationLink(item, index, recordOaStatus, embargoDays, publishedDate));
            });
        }
        return links;
    };

    render() {
        const record = this.props.publication;
        const txt = locale.viewRecord.sections.links;
        if(!record) return (<div className="links empty"/>);
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
