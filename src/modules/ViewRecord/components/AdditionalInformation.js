import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';
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
            default: return this.renderList(objects, subkey);
        }
    }

    // render a single object
    renderObject = (object, subkey) => {
        const data = this.getData(object, subkey);
        switch (subkey) {
            case 'rek_doi': return this.renderDoi(data);
            case 'rek_date_available': return moment(data).format('YYYY');
            case 'rek_journal_name': return this.renderJournalName(data);
            case 'rek_publisher': return this.renderLink(pathConfig.list.publisher(data), data);
            case 'rek_oa_status': return this.renderLink(pathConfig.list.openAccessStatus(object[subkey]), data);
            case 'rek_alternative_genre': return this.renderLink(pathConfig.list.subject(object[subkey]), data);
            case 'rek_herdc_code': return this.renderLink(pathConfig.list.subject(object[subkey]), data);
            case 'rek_herdc_status': return this.renderLink(pathConfig.list.herdcStatus(object[subkey]), data);
            case 'rek_ands_collection_type': return this.renderLink(pathConfig.list.collectionType(object[subkey]), data);
            case 'rek_access_conditions': return this.renderLink(pathConfig.list.accessCondition(object[subkey]), data);
            case 'rek_series': return this.renderLink(pathConfig.list.series(object[subkey]), object[subkey]);
            case 'rek_license': return this.renderLink(pathConfig.list.license(object[subkey]), data);
            case 'rek_org_unit_name': return this.renderLink(pathConfig.list.orgUnitName(data), data);
            case 'rek_institutional_status': return this.renderLink(pathConfig.list.institutionalStatus(object[subkey]), data);
            default: return data;
        }
    }

    renderString = (key, value) => {
        // get values for rek_ fields e.g. rek_title
        let data = '';
        if (key === 'rek_title') {
            data = this.getTitle(this.props.publication);
        } else if (key === 'rek_date') {
            data = moment(value).format('YYYY-MM-DD');
        } else {
            data = value;
        }

        return data;
    }

    renderJournalName = (journalName) => {
        const journalNameElement = <a href={pathConfig.list.journalName(journalName)}>{journalName}</a>;
        const sherpaRomeoData = this.getSherpaRomeo();
        const sherpaRomeoColor = sherpaRomeoData ? sherpaRomeoData.color : null;
        const sherpaRomeoLink = locale.global.sherpaRomeoLink.externalUrl.replace('[issn]', sherpaRomeoData.issn);

        const sherpaRomeoElement = sherpaRomeoColor ?
            (<ExternalLink className={`sherpaRomeo${sherpaRomeoColor[0].toUpperCase() + sherpaRomeoColor.slice(1)}`} href={sherpaRomeoLink} aria-label={locale.global.sherpaRomeoLink.ariaLabel}>
                {locale.viewRecord.linkTexts.journalOpenAccessPolicyLink}
            </ExternalLink>) : <span/>;

        return (
            <span>
                {journalNameElement} {sherpaRomeoElement}
            </span>
        );
    }

    getData = (object, subkey) => {
        const lookupSuffix = '_lookup';
        return object[subkey + lookupSuffix] ? object[subkey + lookupSuffix] : object[subkey];
    }

    getSherpaRomeo = () => {
        const issnField = 'rek_issn';
        const colorField = 'rek_issn_lookup';
        const issns = this.props.publication.fez_record_search_key_issn;
        return issns && Array.isArray(issns) && issns.length > 0 ? {'issn': issns[0][issnField], 'color': issns[0][colorField]} : null;
    }

    getTitle = (publication) => {
        return (
            <span dangerouslySetInnerHTML={{__html: publication.rek_formatted_title ? publication.rek_formatted_title : publication.rek_title}} />
        );
    }

    transformFieldNameToSubkey = (field) => {
        const keyPrefix = 'fez_record_search_key_';
        const subkeyPrefix = 'rek_';
        return field.indexOf(keyPrefix) === 0 ? subkeyPrefix + field.substring(keyPrefix.length) : null;
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

        fields.map((item) => {
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
