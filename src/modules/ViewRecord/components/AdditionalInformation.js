import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';
import {pathConfig} from 'config/routes';
import {viewRecordsConfig} from 'config/viewRecord';
import {Table, TableBody} from 'material-ui/Table';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {AuthorsCitationView, DoiCitationView, EditorsCitationView} from '../../SharedComponents/PublicationCitation/components/citations/partials';
import {ExternalLink} from '../../SharedComponents/ExternalLink';
import ReactHtmlParser from 'react-html-parser';
import ViewRecordTableRow from './ViewRecordTableRow';

const moment = require('moment');
const dompurify = require('dompurify');

export default class AdditionalInformation extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    renderRow = (heading, data) => {
        return (
            <ViewRecordTableRow heading={heading} data={data} key={`additional-info-${heading}`}/>
        );
    }

    renderLink = (link, value) => {
        return <a href={link}>{value}</a>;
    }

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

    // render a list of objects (objects with order fields)
    renderObjectList = (objects, subkey) => {
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

    // render a single object (without order field)
    renderObject = (object, subkey) => {
        const data = this.getData(object, subkey);

        // date fields
        if (viewRecordsConfig.dateFields.includes(subkey)) {
            return this.formatDate(data, viewRecordsConfig.dateFieldFormat[subkey]);
        }

        // html fields
        if (viewRecordsConfig.htmlFields.includes(subkey)) {
            return this.renderHTML(data);
        }

        switch (subkey) {
            case 'rek_doi': return this.renderDoi(data);
            case 'rek_journal_name': return this.renderJournalName(data);
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

    // render rek fields from fez_record_search_key
    renderContent = (key, value) => {
        switch (key) {
            case 'rek_title': return this.renderTitle();
            case 'rek_date': return this.formatPublicationDate(value);
            default: return value;
        }
    }

    renderTitle = () => {
        const {publication} = this.props;
        return this.renderHTML(publication.rek_formatted_title ? publication.rek_formatted_title : publication.rek_title);
    }

    renderLicense = (cvoId, lookup) => {
        const licenseLooup = this.renderLink(pathConfig.list.license(cvoId), lookup);
        const creativeCommonLogo =  viewRecordsConfig.licenseLinks[cvoId] ? viewRecordsConfig.licenseLinks[cvoId] : null;

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
                      (<ExternalLink
                          href={sherpaRomeoLink} aria-label={locale.global.sherpaRomeoLink.ariaLabel}>
                          <span className={`sherpaRomeo${sherpaRomeoColor[0].toUpperCase() + sherpaRomeoColor.slice(1)}`}>{locale.viewRecord.linkTexts.journalOpenAccessPolicyLink}</span>
                      </ExternalLink>);
        }

        return (
            <span>
                {journalNameElement} {sherpaRomeoElement}
            </span>
        );
    }

    renderContributors = (publication) => {
        return (
            <EditorsCitationView key="additional-information-editors" publication={publication} prefix={' '} initialNumberOfEditors={publication.fez_record_search_key_contributor.length} showLink />
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
        return ReactHtmlParser(dompurify.sanitize(data));
    }

    // get lookup data if it exsts, except rek_issn_lookup as it returns sherpa romeo color
    getData = (object, subkey) => {
        const lookupSuffix = '_lookup';
        return object[subkey + lookupSuffix] && subkey !== 'rek_issn' ? object[subkey + lookupSuffix] : object[subkey];
    }

    // rek_issn_lookup returns sherpa romeo color
    getSherpaRomeo = () => {
        const issnField = 'rek_issn';
        const colorField = 'rek_issn_lookup';
        const colors = ['green', 'blue', 'yellow', 'white'];
        const issns = this.props.publication.fez_record_search_key_issn.filter(issn => colors.includes(issn[colorField]));
        return issns.length > 0 ? {'issn': issns[0][issnField], 'color': issns[0][colorField]} : null;
    }

    formatPublicationDate = (publicationDate) => {
        return this.formatDate(publicationDate, viewRecordsConfig.publicationDateFormat[this.props.publication.rek_display_type_lookup]);
    }

    formatDate = (date, format = 'YYYY-MM-DD') => {
        return moment(date).format(format);
    }

    transformFieldNameToSubkey = (field) => {
        const keyPrefix = 'fez_record_search_key_';
        const subkeyPrefix = 'rek_';
        return field.indexOf(keyPrefix) === 0 ? subkeyPrefix + field.substring(keyPrefix.length) : null;
    }

    // TODO: check for user role
    excludeAdminOnlyFields = (fields) => {
        return fields.filter(item=>!locale.viewRecord.adminFields.includes(item.field));
    }

    renderColumns = () => {
        const rows = [];
        const publication = this.props.publication;
        const displayType = publication.rek_display_type_lookup;
        const headings = locale.viewRecord.headings;
        const displayTypeHeadings = displayType && headings[displayType] ? headings[displayType] : [];
        const footerFields = locale.viewRecord.fields.footer;
        let fields = displayType && locale.viewRecord.fields[displayType] ? locale.viewRecord.fields[displayType].concat(footerFields) : footerFields;
        fields = this.excludeAdminOnlyFields(fields);
        console.log(fields);
        fields.sort((field1, field2) => (
            field1.order - field2.order
        )).map((item) => {
            let data = '';
            const field = item.field;
            const value = publication[field];
            console.log(field);
            console.log(value);
            // do not display field when value is null, empty array
            if (value && Object.keys(value).length > 0) {
                const subkey = this.transformFieldNameToSubkey(field);
                const heading = displayTypeHeadings[field] ? displayTypeHeadings[field] : headings.default[field];
                console.log(heading);
                // logic to get values from fez_record_search_key fields
                if (subkey) {
                    data = Array.isArray(value) ? this.renderObjectList(value, subkey) : this.renderObject(value, subkey);
                } else {
                    data = this.renderContent(field, value);
                }

                rows.push(this.renderRow(heading, data));
            }
        });

        return rows;
    }

    render() {
        return (
            <StandardCard title={locale.viewRecord.sections.additionalInformation}>
                <Table selectable={false} className="additionalInformation">
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
