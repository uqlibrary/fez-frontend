import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';
import {viewRecordsConfig, routes} from 'config';
import {Table, TableBody} from 'material-ui/Table';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {AuthorsCitationView, DoiCitationView, EditorsCitationView, DateCitationView} from 'modules/SharedComponents/PublicationCitation/components/citations/partials';
import {ExternalLink} from 'modules/SharedComponents/ExternalLink';
import ReactHtmlParser from 'react-html-parser';
import ViewRecordTableRow from './ViewRecordTableRow';
import PublicationMap from './PublicationMap';
import JournalName from './partials/JournalName';

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
                                    return this.renderLink(getLink(item[subkey], data), data);
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
            case 'rek_keywords': return this.renderList(objects, subkey, routes.pathConfig.list.keyword);
            case 'rek_subject': return this.renderList(objects, subkey, routes.pathConfig.list.subject);
            case 'rek_seo_code': return this.renderList(objects, subkey, routes.pathConfig.list.subject);
            case 'rek_alternate_genre': return this.renderList(objects, subkey, routes.pathConfig.list.subject);
            case 'rek_contact_details_email': return this.renderContactEmail();
            case 'rek_geographic_area': return this.renderMap(objects);
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
            case 'rek_journal_name': return this.renderJournalName();
            case 'rek_publisher': return this.renderLink(routes.pathConfig.list.publisher(data), data);
            case 'rek_oa_status': return !!data ? this.renderLink(routes.pathConfig.list.openAccessStatus(object[subkey]), data) : '';
            case 'rek_herdc_code': return this.renderLink(routes.pathConfig.list.subject(object[subkey]), data);
            case 'rek_herdc_status': return this.renderLink(routes.pathConfig.list.herdcStatus(object[`${subkey}_lookup`]), data);
            case 'rek_ands_collection_type': return !!data && data || '';
            case 'rek_access_conditions': return !!data && data || '';
            case 'rek_series': return this.renderLink(routes.pathConfig.list.series(object[subkey]), object[subkey]);
            case 'rek_license': return this.renderLicense(object[subkey], data);
            case 'rek_org_unit_name': return this.renderLink(routes.pathConfig.list.orgUnitName(data), data);
            case 'rek_institutional_status': return this.renderLink(routes.pathConfig.list.institutionalStatus(object[`${subkey}_lookup`]), data);
            case 'rek_book_title': return this.renderLink(routes.pathConfig.list.bookTitle(object[subkey]), data);
            case 'rek_job_number': return this.renderLink(routes.pathConfig.list.jobNumber(object[subkey]), data);
            case 'rek_conference_name': return this.renderLink(routes.pathConfig.list.conferenceName(object[subkey]), data);
            case 'rek_proceedings_title': return this.renderLink(routes.pathConfig.list.proceedingsTitle(object[subkey]), data);
            default: return data;
        }
    }

    // render rek fields from fez_record_search_key
    renderContent = (key, value) => {
        switch (key) {
            case 'rek_title': return this.renderTitle();
            case 'rek_date': return this.formatPublicationDate(value);
            case 'rek_description': return this.renderHTML(value);
            default: return value;
        }
    }

    renderTitle = () => {
        const {publication} = this.props;
        return this.renderHTML(publication.rek_formatted_title ? publication.rek_formatted_title : publication.rek_title);
    }

    renderLicense = (cvoId, lookup) => {
        const licenseLookup = this.renderLink(routes.pathConfig.list.license(lookup), lookup);
        const licenseLink =  viewRecordsConfig.licenseLinks[cvoId] ? viewRecordsConfig.licenseLinks[cvoId] : null;
        const uqLicenseLinkText = licenseLink && licenseLink.className.indexOf('uq') === 0 ? locale.viewRecord.sections.additionalInformation.licenseLinkText : null;

        return (
            <span>
                {licenseLookup}
                {
                    licenseLink &&
                    <div>
                        <ExternalLink href={licenseLink.url} openInNewIcon={!!uqLicenseLinkText}>
                            {
                                uqLicenseLinkText || <div className={`fez-icon license ${licenseLink.className}`} />
                            }
                        </ExternalLink>
                    </div>
                }
            </span>
        );
    }

    renderJournalName = () => {
        return (
            <JournalName publication={this.props.publication} />
        );
    }

    renderContributors = (publication) => {
        return (
            <EditorsCitationView key="additional-information-editors" publication={publication} prefix={' '} suffix={''} initialNumberOfEditors={publication.fez_record_search_key_contributor.length} showLink />
        );
    }

    renderAuthors = (publication) => {
        return (
            <AuthorsCitationView key="additional-information-authors" publication={publication} initialNumberOfAuthors={publication.fez_record_search_key_author.length} showLink />
        );
    }

    renderMap = (coordinatesList) => {
        if (coordinatesList.length === 0 || !coordinatesList[0].rek_geographic_area) {
            return (<span />);
        }
        return (
            <PublicationMap
                googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{height: '100%'}}/>}
                containerElement={<div style={{height: '400px'}}/>}
                mapElement={<div style={{height: '100%'}}/>}
                coordinates={coordinatesList[0].rek_geographic_area}
            />
        );
    };

    renderDoi = (doi) => {
        return (
            <DoiCitationView key="additional-information-doi" doi={doi}/>
        );
    }

    // title/description/abstract have been sanitized in middleware
    renderHTML = (data) => {
        return ReactHtmlParser(data);
    }

    // get lookup data if it exsts, except rek_issn_lookup as it returns sherpa romeo color
    getData = (object, subkey) => {
        const lookupSuffix = '_lookup';
        return (subkey === 'rek_oa_status' || object[subkey + lookupSuffix] && subkey !== 'rek_issn') ? object[subkey + lookupSuffix] : object[subkey];
    }

    getAbstract = (publication) => {
        return publication.rek_formatted_abstract || publication.rek_description;
    }

    // TODO: display original contact email for admin users
    renderContactEmail = () => {
        return (
            <a href={`mailto:${viewRecordsConfig.genericDataEmail}`}>{viewRecordsConfig.genericDataEmail}</a>
        );
    }

    formatPublicationDate = (publicationDate) => {
        return this.formatDate(publicationDate, viewRecordsConfig.publicationDateFormat[this.props.publication.rek_display_type_lookup]);
    }

    formatDate = (date, format = 'YYYY-MM-DD') => {
        return (
            <DateCitationView format={format} date={date} prefix={''} suffix={''}/>
        );
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

        fields.sort((field1, field2) => (
            field1.order - field2.order
        )).map((item) => {
            let data = '';
            const field = item.field;
            const value = (field === 'rek_description') ? this.getAbstract(publication) : publication[field];

            // do not display field when value is null, empty array
            if (value && Object.keys(value).length > 0) {
                const subkey = this.transformFieldNameToSubkey(field);
                const heading = displayTypeHeadings[field] ? displayTypeHeadings[field] : headings.default[field];

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
        if (!this.props.publication.rek_display_type_lookup) {
            return null;
        }

        return (
            <StandardCard title={locale.viewRecord.sections.additionalInformation.title}>
                <Table selectable={false} className="additionalInformation vertical">
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
