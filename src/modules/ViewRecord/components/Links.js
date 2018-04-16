import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';

import {PubmedCentralLink} from 'modules/SharedComponents/PubmedCentralLink';
import DoiCitationView from 'modules/SharedComponents/PublicationCitation/components/citations/partials/DoiCitationView';
import {ExternalLink} from 'modules/SharedComponents/ExternalLink';
import OpenAccessIcon from 'modules/SharedComponents/Partials/OpenAccessIcon';

import {locale} from 'locale';
import {openAccessConfig} from 'config';

export default class Links extends PureComponent {
    static propTypes = {
        publication: PropTypes.object.isRequired
    };

    renderLinkRow = (item) => {
        return (
            <TableRow key={`link-${item.index}`}>
                <TableRowColumn className="link">
                    {item.link}
                </TableRowColumn>
                <TableRowColumn className="description is-hidden-mobile" title={item.description}>
                    {item.description}
                </TableRowColumn>
                <TableRowColumn className="oa align-right">
                    <OpenAccessIcon {...item.openAccessStatus} />
                </TableRowColumn>
            </TableRow>
        );
    };

    getDOILink = (doi, openAccessStatus) => {
        return {
            index: 'doi',
            link: (<DoiCitationView doi={doi} />),
            description: locale.viewRecord.sections.links.doiDescription,
            openAccessStatus: openAccessStatus
        };
    };

    getPMCLink = (pubmedCentralId, openAccessStatus) => {
        return {
            index: 'pmc',
            link: <PubmedCentralLink pubmedCentralId={pubmedCentralId}/>,
            description: locale.viewRecord.sections.links.pubmedCentralLinkDescription,
            openAccessStatus: openAccessStatus
        };
    };

    getGoogleScholarLink = (title, openAccessStatus) => {
        return {
            index: 'google',
            link: (
                <ExternalLink
                    href={locale.viewRecord.sections.links.googleScholar.linkPrefix.replace('[title]', title)}
                    title={locale.viewRecord.sections.links.googleScholar.linkDescription}>
                    {locale.viewRecord.sections.links.googleScholar.linkPrefix.replace('[title]', title).replace('%22', '"')}
                </ExternalLink>
            ),
            description: locale.viewRecord.sections.links.googleScholar.linkDescription,
            openAccessStatus: openAccessStatus
        };
    };

    getPublicationLink = (link, index, openAccessStatus = {}) => {
        const linkDescription = this.props.publication.fez_record_search_key_link_description
            && this.props.publication.fez_record_search_key_link_description[index]
            && this.props.publication.fez_record_search_key_link_description[index].rek_link_description
            || locale.viewRecord.sections.links.linkMissingDescriptionTitle;
        return {
            index: index,
            link: (
                <ExternalLink href={link.rek_link} title={linkDescription}>
                    {link.rek_link}
                </ExternalLink>
            ),
            description: linkDescription,
            openAccessStatus: openAccessStatus
        };
    };

    render() {
        const record = this.props.publication;

        if (!(record.fez_record_search_key_link && record.fez_record_search_key_link.length > 0
            || record.fez_record_search_key_pubmed_central_id && record.fez_record_search_key_pubmed_central_id.rek_pubmed_central_id
            || record.fez_record_search_key_doi && record.fez_record_search_key_doi.rek_doi
            || record.fez_record_search_key_oa_status && record.fez_record_search_key_oa_status.rek_oa_status === openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI)) {
            return null;
        }

        const txt = locale.viewRecord.sections.links;
        const pubmedCentralId = record.fez_record_search_key_pubmed_central_id
            && record.fez_record_search_key_pubmed_central_id.rek_pubmed_central_id;
        const doi = record.fez_record_search_key_doi
            && record.fez_record_search_key_doi.rek_doi;
        const openAccessStatusId = record.fez_record_search_key_oa_status
            && record.fez_record_search_key_oa_status.rek_oa_status;
        const hasLinks = record.fez_record_search_key_link
            && record.fez_record_search_key_link.length > 0;

        // show open access status on links only if open access status is related to links, eg DOI, LINK, PMC
        const openAccessStatus = openAccessConfig.openAccessLinks.indexOf(openAccessStatusId) >= 0 && record.calculateOpenAccess
            ? record.calculateOpenAccess()
            : {};

        return (
            <StandardCard title={txt.title}>
                <div className="viewRecordLinks">
                    <Table selectable={false} className="links horizontal">
                        <TableHeader adjustForCheckbox={false} displaySelectAll={false} className="header">
                            <TableRow>
                                <TableHeaderColumn className="link">{txt.headerTitles.link}</TableHeaderColumn>
                                <TableHeaderColumn className="description is-hidden-mobile">{txt.headerTitles.description}</TableHeaderColumn>
                                <TableHeaderColumn className="oa align-right">{txt.headerTitles.oaStatus}</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false} className="data">
                            {
                                // if record has a PubMedCentral Id - display link, should be always OA
                                !!pubmedCentralId &&
                                this.renderLinkRow(this.getPMCLink(pubmedCentralId, openAccessStatus))
                            }
                            {
                                // if record has a DOI - display a link, should be OA or OA with a date
                                !!doi &&
                                this.renderLinkRow(this.getDOILink(doi, openAccessStatus))
                            }
                            {
                                // record has OA status of "Link (no DOI)" then produce a google scholar link for the publication title
                                openAccessStatusId === openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI &&
                                this.renderLinkRow(this.getGoogleScholarLink(record.rek_title, openAccessStatus))
                            }
                            {
                                hasLinks &&
                                record.fez_record_search_key_link.map((item, index) => (
                                    this.renderLinkRow(this.getPublicationLink(item, index))
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>
            </StandardCard>
        );
    }
}
