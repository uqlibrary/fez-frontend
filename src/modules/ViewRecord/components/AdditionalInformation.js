import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';
import {licenseLinks} from 'config/general';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {AuthorsCitationView, DoiCitationView} from '../../SharedComponents/PublicationCitation/components/citations/partials';
import {ExternalLink} from '../../SharedComponents/ExternalLink';
import {pathConfig} from 'config/routes';

const moment = require('moment');

export default class AdditionalInformation extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    renderRow = (heading, data) => {
        return (
            <TableRow key={heading} className="tableRow">
                <TableRowColumn className="headingColumn">
                    {heading}
                </TableRowColumn>
                <TableRowColumn className="dataColumn">
                    {data}
                </TableRowColumn>
            </TableRow>
        );
    }

    renderLink = (link, value) => {
        return <a href={link}>{value}</a>;
    }

    // render array of objects
    renderList = (list, subkey, getLink) => {
        return (
            <ul key={subkey}>
                {
                    list.map((item, index) => (
                        <li key={`${subkey}-${index}`}>
                            {(() => {
                                const data = this.getData(item, subkey);
                                if (getLink) {
                                    return this.renderLink(getLink(item[subkey]), data);
                                } else {
                                    return data;
                                }
                            })()}
                        </li>
                    ))
                }
            </ul>
        );
    }

    renderObjects = (objects, subkey) => {
        switch (subkey) {
            case 'rek_author': return this.renderAuthors(this.props.publication);
            case 'rek_contributor': return this.renderContributors(this.props.publication);
            case 'rek_keywords': return this.renderList(objects, subkey, pathConfig.list.keyword);
            case 'rek_subject': return this.renderList(objects, subkey, pathConfig.list.subject);
            case 'rek_fields_of_research': return this.renderList(objects, subkey, pathConfig.list.subject);
            case 'rek_seo_code': return this.renderList(objects, subkey, pathConfig.list.subject);
            case 'rek_alternate_genre': return this.renderList(objects, subkey, pathConfig.list.subject);
            default: return this.renderList(objects, subkey);
        }
    }

    // render a single object
    renderObject = (object, subkey) => {
        const data = this.getData(object, subkey);
        switch (subkey) {
            case 'rek_doi': return this.renderDoi(data);
            case 'rek_date_available': return this.formatDate(data, 'YYYY');
            case 'rek_date_recorded': return this.formatDate(data);
            case 'rek_date_photo_taken': return this.formatDate(data, 'YYYY');
            case 'rek_date_scanned': return this.formatDate(data);
            case 'rek_start_date': return this.formatDate(data);
            case 'rek_end_date': return this.formatDate(data);
            case 'rek_time_period_start_date': return this.formatDate(data);
            case 'rek_time_period_end_date': return this.formatDate(data);
            case 'rek_project_start_date': return this.formatDate(data);
            case 'rek_journal_name': return this.renderJournalName(data);
            case 'rek_project_description': return this.renderHTML(data);
            case 'rek_transcript': return this.renderHTML(data);
            case 'rek_notes': return this.renderHTML(data);
            case 'rek_additional_notes': return this.renderHTML(data);
            case 'rek_publisher': return this.renderLink(pathConfig.list.publisher(data), data);
            case 'rek_oa_status': return this.renderLink(pathConfig.list.openAccessStatus(object[subkey]), data);
            case 'rek_herdc_code': return this.renderLink(pathConfig.list.subject(object[subkey]), data);
            case 'rek_herdc_status': return this.renderLink(pathConfig.list.herdcStatus(object[subkey]), data);
            case 'rek_ands_collection_type': return this.renderLink(pathConfig.list.collectionType(object[subkey]), data);
            case 'rek_access_conditions': return this.renderLink(pathConfig.list.accessCondition(object[subkey]), data);
            case 'rek_series': return this.renderLink(pathConfig.list.series(object[subkey]), object[subkey]);
            case 'rek_license': return this.renderLicense(object[subkey], data);
            case 'rek_org_unit_name': return this.renderLink(pathConfig.list.orgUnitName(data), data);
            case 'rek_institutional_status': return this.renderLink(pathConfig.list.institutionalStatus(object[subkey]), data);
            case 'rek_book_title': return this.renderLink(pathConfig.list.bookTitle(object[subkey]), data);
            case 'rek_conference_name': return this.renderLink(pathConfig.list.conferenceName(object[subkey]), data);
            default: return data;
        }
    }

    renderString = (key, value) => {
        // get values for rek_ fields e.g. rek_title
        switch (key) {
            case 'rek_title': return this.renderTitle(this.props.publication);
            case 'rek_date': return this.formatPublicationDate(value);
            default: return value;
        }
    }

    renderLicense = (cvoId, lookup) => {
        const licenseLooup = this.renderLink(pathConfig.list.license(cvoId), lookup);
        const creativeCommonLogo =  licenseLinks[cvoId] ? licenseLinks[cvoId] : null;
        return (
            <span>
                {licenseLooup}
                { creativeCommonLogo &&
                    <div><ExternalLink className={'fez-icon license ' + creativeCommonLogo.className} href={creativeCommonLogo.url} /></div>
                }
            </span>
        );
    }

    renderJournalName = (journalName) => {
        const journalNameElement = <a href={pathConfig.list.journalName(journalName)}>{journalName}</a>;
        const sherpaRomeoData = this.getSherpaRomeo();
        let sherpaRomeoElement = <span/>;

        if (sherpaRomeoData) {
            const sherpaRomeoColor = sherpaRomeoData.color;
            const sherpaRomeoLink = locale.global.sherpaRomeoLink.externalUrl.replace('[issn]', sherpaRomeoData.issn);
            sherpaRomeoElement =
                      (<ExternalLink className={`sherpaRomeo${sherpaRomeoColor[0].toUpperCase() + sherpaRomeoColor.slice(1)}`}
                          href={sherpaRomeoLink} aria-label={locale.global.sherpaRomeoLink.ariaLabel}>
                          {locale.viewRecord.linkTexts.journalOpenAccessPolicyLink}
                      </ExternalLink>);
        }

        return (
            <span>
                {journalNameElement} {sherpaRomeoElement}
            </span>
        );
    }

    renderTitle = (publication) => {
        return (
            <span dangerouslySetInnerHTML={{__html: publication.rek_formatted_title ? publication.rek_formatted_title : publication.rek_title}} />
        );
    }

    renderContributors = (publication) => {
        const searchKey = {
            key: 'fez_record_search_key_contributor',
            subkey: 'rek_contributor',
            order: 'rek_contributor_order'
        };
        const idSearchKey = {
            idKey: 'fez_record_search_key_contributor_id',
            idSubkey: 'rek_contributor_id',
            idOrder: 'rek_contributor_id_order'
        };

        return (
            <AuthorsCitationView key="additional-information-editors" publication={publication} searchKey={searchKey} idSearchKey={idSearchKey} initialNumberOfAuthors={publication.fez_record_search_key_contributor.length} showLink/>
        );
    }

    renderAuthors = (publication) => {
        return (
            <AuthorsCitationView key="additional-information-authors" publication={publication} initialNumberOfAuthors={publication.fez_record_search_key_author.length} showLink />
        );
    }

    renderDoi = (doi) => {
        return (
            <DoiCitationView key="additional-information-doi" doi={doi}/>
        );
    }

    renderHTML = (data) => {
        return (
            <span dangerouslySetInnerHTML={{__html: data}} />
        );
    }

    // rek_issn_lookup returns sherpa romeo color
    getData = (object, subkey) => {
        const lookupSuffix = '_lookup';
        return object[subkey + lookupSuffix] && subkey !== 'rek_issn' ? object[subkey + lookupSuffix] : object[subkey];
    }

    getSherpaRomeo = () => {
        const issnField = 'rek_issn';
        const colorField = 'rek_issn_lookup';
        const colors = ['green', 'blue', 'yellow', 'white'];
        const issns = this.props.publication.fez_record_search_key_issn.filter(issn => colors.includes(issn[colorField]));
        return issns && Array.isArray(issns) && issns.length > 0 ? {'issn': issns[0][issnField], 'color': issns[0][colorField]} : null;
    }

    formatPublicationDate = (publicationDate) => {
        const headings = locale.viewRecord.headings;
        const displayTypeHeadings = headings[this.props.publication.rek_display_type_lookup] ? headings[this.props.publication.rek_display_type_lookup] : [];
        const publicationDateFormatConfig = 'rek_date_format';
        const dateFormat = displayTypeHeadings[publicationDateFormatConfig] ? displayTypeHeadings[publicationDateFormatConfig] : headings[publicationDateFormatConfig];
        return this.formatDate(publicationDate, dateFormat);
    }

    formatDate = (date, format = 'YYYY-MM-DD') => {
        return moment(date).format(format);
    }

    transformFieldNameToSubkey = (field) => {
        const keyPrefix = 'fez_record_search_key_';
        const subkeyPrefix = 'rek_';
        return field.indexOf(keyPrefix) === 0 ? subkeyPrefix + field.substring(keyPrefix.length) : null;
    }

    renderFooter = () => {
        const rows = [];
        const publication = this.props.publication;
        const footer = locale.viewRecord.headings.default.footer;

        // common fields for all display types
        Object.keys(footer).forEach((field) => {
            const data = publication[field];
            const subkey = this.transformFieldNameToSubkey(field);

            if (data) {
                rows.push(this.renderRow(footer[field], this.renderObject(data, subkey)));
            }
        });
        return rows;
    }

    renderColumns = () => {
        const rows = [];
        const publication = this.props.publication;
        const displayType = publication.rek_display_type_lookup;
        const headings = locale.viewRecord.headings;
        const displayTypeHeadings = displayType && headings[displayType] ? headings[displayType] : [];
        const fields = displayType && locale.viewRecord.fields[displayType] ? locale.viewRecord.fields[displayType] : [];

        fields.sort((field1, field2) => (
            field1.order - field2.order
        )).map((item) => {
            let data = '';
            const field = item.field;
            const value = publication[field];

            // do not display field when value is null, empty array
            if (value && Object.keys(value).length > 0) {
                const subkey = this.transformFieldNameToSubkey(field);
                const heading = displayTypeHeadings[field] ? displayTypeHeadings[field] : headings.default[field];

                // logic to get values from fez_record_search_key fields
                if (subkey) {
                    data = Array.isArray(value) ? this.renderObjects(value, subkey) : this.renderObject(value, subkey);
                } else {
                    data = this.renderString(field, value);
                }

                rows.push(this.renderRow(heading, data));
            }
        });

        // common fields for all display types
        rows.push(this.renderFooter());

        return rows;
    }

    render() {
        return (
            <StandardCard title={locale.viewRecord.sections.additionalInformation}>
                <Table selectable={false}>
                    <TableBody displayRowCheckbox={false}>
                        {
                            this.renderColumns()
                        }
                    </TableBody>
                </Table>
            </StandardCard>
        );
    }
}
