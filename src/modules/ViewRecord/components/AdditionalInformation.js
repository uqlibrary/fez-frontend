import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import locale from 'locale/viewRecord';
import { pathConfig, viewRecordsConfig } from 'config';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import {
    AuthorsCitationView,
    DateCitationView,
    DoiCitationView,
    EditorsCitationView,
} from 'modules/SharedComponents/PublicationCitation/components/citations/partials';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { parseHtmlToJSX } from 'helpers/general';
import PublicationMap from './PublicationMap';
import JournalName from './partials/JournalName';
import { Link } from 'react-router-dom';
import { CURRENT_LICENCES, NTRO_SUBTYPE_CW_TEXTUAL_WORK, PLACEHOLDER_ISO8601_ZULU_DATE } from 'config/general';

import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const renderAuthors = (publication, props = {}) => {
    const componentProps = {
        citationStyle: 'all',
        key: 'additional-information-authors',
        publication,
        prefix: '',
        suffix: '',
        separator: ', ',
        showLink: true,
        ...props,
    };
    return <AuthorsCitationView {...componentProps} />;
};

export const formatDate = (date, format = 'YYYY-MM-DD') => {
    return <DateCitationView format={format} date={date} prefix={''} suffix={''} data-testid="rek-date" />;
};

export const formatPublicationDate = (publicationDate, displayTypeLookup) => {
    return formatDate(publicationDate, viewRecordsConfig.publicationDateFormat[displayTypeLookup]);
};

export class AdditionalInformation extends PureComponent {
    static propTypes = {
        account: PropTypes.object,
        publication: PropTypes.object.isRequired,
        isNtro: PropTypes.bool,
    };

    renderRow = (heading, data, index, field) => {
        const labelTestId = `${field.replace(/_/g, '-')}-label`;
        return (
            <Box
                sx={theme => ({
                    padding: { xs: `${theme.spacing(1)} 0`, sm: 1 },
                })}
                key={index}
            >
                <Grid
                    container
                    spacing={2}
                    padding={0}
                    key={`additional-info-${heading}`}
                    sx={{
                        borderBottom: '1px solid',
                        borderBottomColor: 'secondary.light',
                    }}
                    alignItems="flex-start"
                >
                    <Grid xs={12} sm={3}>
                        <Typography variant="body2" component={'span'} data-testid={labelTestId}>
                            {heading}
                        </Typography>
                    </Grid>
                    <Grid xs={12} sm={9}>
                        <Typography variant="body2" component={'span'}>
                            {data}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        );
    };

    renderLink = (link, value, testId = '') => {
        return (
            <Link to={link} {...{ ['data-testid']: testId || undefined }}>
                {value}
            </Link>
        );
    };

    renderList = (list, subkey, getLink) => {
        const testId = subkey.replace(/_/g, '-');
        return (
            <Box component={'ul'} key={subkey} sx={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                {list.map((item, index) => (
                    <li key={`${testId}-${index}`} data-testid={`${testId}-${index}`}>
                        {(() => {
                            const data = this.getData(item, subkey);
                            if (getLink) {
                                return this.renderLink(getLink(item[subkey], data), data);
                            } else {
                                return data;
                            }
                        })()}
                    </li>
                ))}
            </Box>
        );
    };

    // render a list of objects (objects with order fields)
    renderObjectList = (objects, subkey) => {
        switch (subkey) {
            case 'rek_author':
                return renderAuthors(this.props.publication);
            case 'rek_contributor':
                return this.renderContributors(this.props.publication);
            case 'rek_keywords':
                return this.renderList(objects, subkey, pathConfig.list.keyword);
            case 'rek_seo_code':
                return this.renderList(objects, subkey, pathConfig.list.subject);
            case 'rek_alternate_genre':
                return this.renderList(objects, subkey, pathConfig.list.subject);
            case 'rek_contact_details_email':
                return this.renderContactEmail();
            case 'rek_geographic_area':
                return this.renderMap(objects);
            case 'rek_subject':
                return this.renderList(objects, subkey, pathConfig.list.subject);
            default:
                return this.renderList(objects, subkey);
        }
    };

    // render a single object (without order field)
    renderObject = (object, subkey) => {
        const data = this.getData(object, subkey);

        // date fields
        if (viewRecordsConfig.dateFields.includes(subkey)) {
            return formatDate(data, viewRecordsConfig.dateFieldFormat[subkey]);
        }

        // html fields
        if (viewRecordsConfig.htmlFields.includes(subkey)) {
            return this.renderHTML(data);
        }

        const testId = subkey.replace(/_/g, '-');
        switch (subkey) {
            case 'rek_doi':
                return this.renderDoi(data);
            case 'rek_journal_name':
                return this.renderJournalName();
            case 'rek_publisher':
                return this.renderLink(pathConfig.list.publisher(data), data, testId);
            case 'rek_herdc_code':
                return this.renderLink(pathConfig.list.herdcStatus(object[subkey]), data, testId);
            case 'rek_herdc_status':
                return this.renderLink(pathConfig.list.herdcStatus(object[`${subkey}_lookup`]), data, testId);
            case 'rek_ands_collection_type':
            case 'rek_access_conditions':
                return !!data && <span data-testid={testId}>{data}</span>;
            case 'rek_series':
                return this.renderLink(pathConfig.list.series(object[subkey]), object[subkey], testId);
            case 'rek_license':
                return this.renderLicense(object[subkey], data);
            case 'rek_org_unit_name':
                return this.renderLink(pathConfig.list.orgUnitName(data), data, testId);
            case 'rek_institutional_status':
                return this.renderLink(pathConfig.list.institutionalStatus(object[`${subkey}_lookup`]), data, testId);
            case 'rek_book_title':
                return this.renderLink(pathConfig.list.bookTitle(object[subkey]), data, testId);
            case 'rek_job_number':
                return this.renderLink(pathConfig.list.jobNumber(object[subkey]), data, testId);
            case 'rek_conference_name':
                return this.renderLink(pathConfig.list.conferenceName(object[subkey]), data, testId);
            case 'rek_proceedings_title':
                return this.renderLink(pathConfig.list.proceedingsTitle(object[subkey]), data, testId);
            default:
                return <span data-testid={testId}>{data}</span>;
        }
    };

    // render rek fields from fez_record_search_key
    renderContent = (key, value) => {
        let renderedValue;
        switch (key) {
            case 'rek_title':
                renderedValue = this.renderTitle();
                break;
            case 'rek_date':
                // case 'rek_start_date':
                // case 'rek_end_date':
                renderedValue = formatPublicationDate(value, this.props.publication.rek_display_type_lookup);
                break;
            case 'rek_description':
                renderedValue = this.renderHTML(value);
                break;
            case 'rek_ci_notice_attribution_incomplete':
                renderedValue = this.renderCulturalInstitutionNotice();
                break;
            default:
                renderedValue = value;
        }
        return <span data-testid={key.replace(/_/g, '-')}>{renderedValue}</span>;
    };

    renderTitle = () => {
        const { publication } = this.props;
        return this.renderHTML(
            publication.rek_formatted_title ? publication.rek_formatted_title : publication.rek_title,
        );
    };

    renderLicense = (cvoId, lookup) => {
        const licenseLookup = this.renderLink(pathConfig.list.license(lookup), lookup, 'rek-license-lookup');
        const licenseLink = viewRecordsConfig.licenseLinks[cvoId] ? viewRecordsConfig.licenseLinks[cvoId] : null;
        const uqLicenseLinkText =
            licenseLink && licenseLink.className.indexOf('uq') === 0
                ? locale.viewRecord.sections.additionalInformation.licenseLinkText
                : null;
        const licenseLinkDetails = CURRENT_LICENCES.filter(licence => {
            return cvoId === licence.value;
        });
        const licenseLinkDetail = !!licenseLinkDetails && licenseLinkDetails.length > 0 && licenseLinkDetails.shift();

        return (
            <span>
                {licenseLookup}
                {licenseLinkDetail &&
                    licenseLinkDetail.description.length > 0 &&
                    licenseLinkDetail.description.map((line, index) => (
                        <p key={`license_description_line-${index}`}>{line}</p>
                    ))}
                {licenseLink && (
                    <ExternalLink href={licenseLink.url} openInNewIcon={!!uqLicenseLinkText} id="rek-license">
                        {uqLicenseLinkText || <div className={`fez-icon license ${licenseLink.className}`} />}
                    </ExternalLink>
                )}
            </span>
        );
    };

    renderCulturalInstitutionNotice = () => {
        return (
            <span>
                <div
                    data-testid="fez-icon-cilabel"
                    className={'fez-icon_cilabel'}
                    style={{
                        backgroundImage: `url(${locale.viewRecord.culturalNoticeAI.imagePath})`,
                        width: 100,
                        height: 100,
                        backgroundSize: 'cover',
                    }}
                />
                <br />
                <strong>{locale.viewRecord.culturalNoticeAI.title} - </strong>
                {locale.viewRecord.culturalNoticeAI.text}
            </span>
        );
    };

    renderJournalName = () => {
        return <JournalName publication={this.props.publication} />;
    };

    renderContributors = publication => {
        return (
            <EditorsCitationView
                citationStyle="all"
                key="additional-information-editors"
                publication={publication}
                prefix={''}
                suffix={''}
                separator={', '}
                showLink
            />
        );
    };

    renderMap = coordinatesList => {
        if (coordinatesList.length === 0 || !coordinatesList[0].rek_geographic_area) {
            return <span />;
        }
        /*
         *  New map doesn't support the dynamic google URLs. e.g. GOOGLE_MAPS_API_CHINA_URL
         */
        return <PublicationMap coordinates={coordinatesList[0].rek_geographic_area} readOnly />;
    };

    renderDoi = doi => {
        return doi ? <DoiCitationView key="additional-information-doi" doi={doi} /> : null;
    };

    // title/description/abstract have been sanitized in middleware
    renderHTML = data => {
        return parseHtmlToJSX(data);
    };

    // get lookup data if it exsts, except rek_issn_lookup as it returns sherpa romeo color
    getData = (object, subkey) => {
        const lookupSuffix = '_lookup';
        return subkey === 'rek_oa_status' || (object[subkey + lookupSuffix] && subkey !== 'rek_issn')
            ? object[subkey + lookupSuffix]
            : object[subkey];
    };

    getAbstract = publication => {
        return this.props.isNtro
            ? null
            : (publication.rek_formatted_abstract && publication.rek_formatted_abstract.replace(/&nbsp;/g, ' ')) ||
                  (publication.rek_description && publication.rek_description.replace(/&nbsp;/g, ' ')) ||
                  null;
    };

    // TODO: display original contact email for admin users
    renderContactEmail = () => {
        return (
            <a href={`mailto:${viewRecordsConfig.genericDataEmail}`} data-testid="rek-contact-details-email">
                {viewRecordsConfig.genericDataEmail}
            </a>
        );
    };

    transformFieldNameToSubkey = field => {
        const keyPrefix = 'fez_record_search_key_';
        const subkeyPrefix = 'rek_';
        return field.indexOf(keyPrefix) === 0 ? subkeyPrefix + field.substring(keyPrefix.length) : null;
    };

    getCINoticeValue = publication => {
        return !!publication.rek_ci_notice_attribution_incomplete &&
            publication.rek_ci_notice_attribution_incomplete === 1
            ? [true]
            : null;
    };

    excludeAdminOnlyFields = fields => {
        return fields.filter(item => !locale.viewRecord.adminFields.includes(item.field));
    };

    getFieldHeading = (displayTypeHeadings, headings, field, isNtro) => {
        if (displayTypeHeadings[field]) {
            return typeof displayTypeHeadings[field] === 'function'
                ? displayTypeHeadings[field](
                      isNtro && this.props.publication.rek_subtype !== NTRO_SUBTYPE_CW_TEXTUAL_WORK,
                  )
                : displayTypeHeadings[field];
        } else {
            return headings.default[field];
        }
    };

    renderColumns = () => {
        const rows = [];
        const publication = this.props.publication;

        const displayType = publication.rek_display_type_lookup;
        const headings = locale.viewRecord.headings;
        const displayTypeHeadings = displayType && headings[displayType] ? headings[displayType] : [];
        const footerFields = locale.viewRecord.fields.footer;
        let fields =
            displayType && locale.viewRecord.fields[displayType]
                ? locale.viewRecord.fields[displayType].concat(footerFields)
                : footerFields;
        fields = this.props.account && this.props.account.canMasquerade ? fields : this.excludeAdminOnlyFields(fields);

        fields
            .sort((field1, field2) => field1.order - field2.order)
            .map((item, index) => {
                let data = '';
                const field = item.field;
                let value;
                switch (field) {
                    case 'rek_description':
                        value = this.getAbstract(publication);
                        break;
                    case 'rek_date':
                        value = moment(publication[field]).isSame(moment(PLACEHOLDER_ISO8601_ZULU_DATE))
                            ? null
                            : publication[field];
                        break;
                    case 'rek_ci_notice_attribution_incomplete':
                        value = this.getCINoticeValue(publication);
                        break;
                    case 'fez_record_search_key_herdc_code':
                        const subkey = this.transformFieldNameToSubkey(field);
                        value = publication[field] && publication[field][subkey] !== 0 ? publication[field] : null;
                        break;
                    default:
                        value = publication[field];
                }

                // do not display field when value is null, empty array
                if (value && Object.keys(value).length > 0) {
                    const subkey = this.transformFieldNameToSubkey(field);
                    const heading = this.getFieldHeading(displayTypeHeadings, headings, field, this.props.isNtro);

                    // logic to get values from fez_record_search_key fields
                    if (subkey) {
                        data = Array.isArray(value)
                            ? this.renderObjectList(value, subkey)
                            : this.renderObject(value, subkey);
                    } else {
                        data = this.renderContent(field, value);
                    }

                    if (data) {
                        rows.push(this.renderRow(heading, data, index, subkey || field));
                    }
                }
            });

        return rows;
    };

    render() {
        if (!this.props.publication || !this.props.publication.rek_display_type_lookup) {
            return null;
        }
        return (
            <Grid xs={12}>
                <StandardCard title={locale.viewRecord.sections.additionalInformation.title}>
                    {this.renderColumns()}
                </StandardCard>
            </Grid>
        );
    }
}

export default AdditionalInformation;
