import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {AuthorsCitationView, DoiCitationView, EditorsCitationView} from '../../SharedComponents/PublicationCitation/components/citations/partials';
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

    // render a single object
    renderObject = (object, subkey) => {
        const lookupSuffix = '_lookup';
        switch (subkey) {
            case 'rek_doi': return this.renderDoi(object[subkey]);
            case 'rek_date_available': return moment(object[subkey]).format('YYYY');
            case 'rek_journal_name': return this.renderJournalName(object[subkey]);
            case 'rek_oa_status': return this.renderLink(pathConfig.list.openAccessStatus(object[subkey]), object[subkey + lookupSuffix]);
            case 'rek_herdc_code': return this.renderLink(pathConfig.list.herdcCode(object[subkey]), object[subkey + lookupSuffix]);
            case 'rek_herdc_status': return this.renderLink(pathConfig.list.herdcStatus(object[subkey]), object[subkey + lookupSuffix]);
            default: return object[subkey + lookupSuffix] ? object[subkey + lookupSuffix] : object[subkey];
        }
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

    getSherpaRomeo = () => {
        const issnField = 'rek_issn';
        const colorField = 'rek_issn_lookup';
        const issns = this.props.publication.fez_record_search_key_issn;
        return issns && Array.isArray(issns) && issns.length > 0 ? {'issn': issns[0][issnField], 'color': issns[0][colorField]} : null;
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

    getTitle = (publication) => {
        return (
            <span dangerouslySetInnerHTML={{__html: publication.rek_formatted_title ? publication.rek_formatted_title : publication.rek_title}} />
        );
    }

    renderContributors = (publication) => {
        return (
            <EditorsCitationView key="additional-information-editors" publication={publication}/>
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

    renderObjects = (objects, subkey) => {
        switch (subkey) {
            case 'rek_author': return this.renderAuthors(this.props.publication);
            case 'rek_contributor': return this.renderContributors(this.props.publication);
            case 'rek_subject': return this.renderList(objects, subkey, pathConfig.list.subject);
            case 'rek_keywords': return this.renderList(objects, subkey, pathConfig.list.keyword);
            default: return this.renderList(objects, subkey);
        }
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
                                if (getLink) {
                                    return this.renderLink(getLink(item[subkey]), item[subkey]);
                                } else {
                                    return item[subkey];
                                }
                            })()}
                        </li>
                    ))
                }
            </ul>
        );
    }

    renderColumns = () => {
        const rows = [];
        const keyPrefix = 'fez_record_search_key_';
        const subkeyPrefix = 'rek_';
        const publication = this.props.publication;
        const fields = locale.viewRecord.fields;

        // element might have null values
        Object.keys(publication).forEach((key) => {
            let data = '';
            const value = publication[key];

            // do not display when value is null, empty array or no matching field locale
            if (value && Object.keys(value).length > 0 && fields.default[key]) {
                const subkey = key.indexOf(keyPrefix) === 0 ? subkeyPrefix + key.substring(keyPrefix.length) : null;
                const heading = fields[publication.rek_display_type_lookup] ? fields[publication.rek_display_type_lookup][key] : fields.default[key];

                // logic to get values from fez_record_search_key fields
                if (subkey) {
                    data = Array.isArray(value) ? this.renderObjects(value, subkey) : this.renderObject(value, subkey);
                } else {
                    data = this.renderString(key, value);
                }

                rows.push(this.renderRow(heading, data));
            }
        });

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
