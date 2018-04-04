import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';

import {PubmedCentralLink} from 'modules/SharedComponents/PubmedCentralLink';
import DoiCitationView from 'modules/SharedComponents/PublicationCitation/components/citations/partials/DoiCitationView';
import {ExternalLink} from 'modules/SharedComponents/ExternalLink';
import OpenAccessIcon from './partials/OpenAccessIcon';

import {locale} from 'locale';
import {OPEN_ACCESS_ID_LINK_NO_DOI, OPEN_ACCESS_ID_DOI} from 'config/general';

import moment from 'moment';

export default class ViewRecordLinks extends PureComponent {
    static propTypes = {
        publication: PropTypes.object.isRequired
    };

    renderLinkRow = (item) => {
        return (
            <TableRow key={`link-${item.index}`}>
                <TableRowColumn className="rowLink">
                    {item.link}
                </TableRowColumn>
                <TableRowColumn className="rowDescription is-hidden-mobile" title={item.description}>
                    {item.description}
                </TableRowColumn>
                <TableRowColumn className="rowOA align-right">
                    <OpenAccessIcon {...item.openAccessStatus} showEmbargoText />
                </TableRowColumn>
            </TableRow>
        );
    };

    getDOILink = (openAccessStatusId, doi, pubmedCentralId) => {
        return {
            index: 'doi',
            link: (<DoiCitationView doi={doi} />),
            description: locale.viewRecord.sections.links.doiDescription,
            openAccessStatus: {
                isOpenAccess: openAccessStatusId === OPEN_ACCESS_ID_DOI && !pubmedCentralId,
                openAccessStatusId: openAccessStatusId,
            }
        };
    };

    getPMCLink = (openAccessStatusId, pubmedCentralId) => {
        return {
            index: 'pmc',
            link: <PubmedCentralLink pubmedCentralId={pubmedCentralId}/>,
            description: locale.viewRecord.sections.links.pubmedCentralLinkDescription,
            openAccessStatus: {
                isOpenAccess: true,
                openAccessStatusId: openAccessStatusId,
            }
        };
    };

    getGoogleScholarLink = (openAccessStatusId, title) => {
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
            openAccessStatus: {
                isOpenAccess: true,
                openAccessStatusId: openAccessStatusId,
            }
        };
    };

    getPublicationLink = (openAccessStatusId, link, index, isOpenAccess, embargoDate) => {
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
            openAccessStatus: {
                isOpenAccess: isOpenAccess,
                embargoDate: embargoDate,
                openAccessStatusId: openAccessStatusId,
            }
        };
    };

    isRecordOpenAccess = (record) => {
        const openAccessStatusId = record.fez_record_search_key_oa_status
            && record.fez_record_search_key_oa_status.rek_oa_status;
        const embargoDays = record.fez_record_search_key_oa_embargo_days
            && record.fez_record_search_key_oa_embargo_days.rek_oa_embargo_days
            || 0;
        const publishedDate = record.rek_date;
        const currentDate = moment().format();
        const embargoDate = embargoDays ? moment(publishedDate).add(embargoDays, 'days').format() : null;
        const pastEmgargoDate = !embargoDate || embargoDate < currentDate;
        let isOpenAccess = false;
        if (openAccessStatusId !== OPEN_ACCESS_ID_LINK_NO_DOI) return {isOpenAccess: false, embargoDate: null};
        else isOpenAccess = pastEmgargoDate;
        const displayEmbargoDate = !!embargoDate && !isOpenAccess && embargoDate > currentDate ? moment(embargoDate).format('Do MMMM YYYY') : null;
        return {isOpenAccess: isOpenAccess, embargoDate: displayEmbargoDate};
    };

    render() {
        const record = this.props.publication;

        if (!(record.fez_record_search_key_link && record.fez_record_search_key_link.length > 0
            || record.fez_record_search_key_pubmed_central_id && record.fez_record_search_key_pubmed_central_id.rek_pubmed_central_id
            || record.fez_record_search_key_doi && record.fez_record_search_key_doi.rek_doi
            || record.fez_record_search_key_oa_status && record.fez_record_search_key_oa_status.rek_oa_status === OPEN_ACCESS_ID_LINK_NO_DOI)) {
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

        const {isOpenAccess, embargoDate} = this.isRecordOpenAccess(record);
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
                            {
                                !!pubmedCentralId &&
                                this.renderLinkRow(this.getPMCLink(openAccessStatusId, pubmedCentralId))
                            }
                            {
                                !!doi &&
                                this.renderLinkRow(this.getDOILink(openAccessStatusId, doi, pubmedCentralId))
                            }
                            {
                                // record has OA status of "Link (no DOI)" then produce a google scholar link for the publication title
                                openAccessStatusId === OPEN_ACCESS_ID_LINK_NO_DOI &&
                                this.renderLinkRow(this.getGoogleScholarLink(openAccessStatusId, record.rek_title))
                            }
                            {
                                hasLinks &&
                                record.fez_record_search_key_link.map((item, index) => (
                                    this.renderLinkRow(this.getPublicationLink(openAccessStatusId, item, index, isOpenAccess, embargoDate))
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>
            </StandardCard>
        );
    }
}
