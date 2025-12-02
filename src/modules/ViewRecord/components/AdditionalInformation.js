import React from 'react';
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
import {
    CURRENT_LICENCES,
    NTRO_SUBTYPE_CW_TEXTUAL_WORK,
    PLACEHOLDER_ISO8601_ZULU_DATE,
    PUBLICATION_TYPE_INSTRUMENT,
    ORCID_BASE_URL,
    ROR_BASE_URL,
} from 'config/general';
import { isValidOrcid, isValidROR } from 'config/validation';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

export const formatDate = (date, format = 'YYYY-MM-DD') => {
    return <DateCitationView format={format} date={date} prefix={''} suffix={''} data-testid="rek-date" />;
};

export const formatPublicationDate = (publicationDate, displayTypeLookup) => {
    return formatDate(publicationDate, viewRecordsConfig.publicationDateFormat[displayTypeLookup]);
};

const AdditionalInformation = ({ account, publication, isNtro }) => {
    const renderAuthors = (publication, props = {}) => {
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

    // get lookup data if it exists, except rek_issn_lookup as it returns sherpa romeo color
    const getData = (object, subkey) => {
        const lookupSuffix = '_lookup';
        return subkey === 'rek_oa_status' || (object[subkey + lookupSuffix] && subkey !== 'rek_issn')
            ? object[subkey + lookupSuffix]
            : object[subkey];
    };

    const getAbstract = publication => {
        return isNtro
            ? null
            : (publication.rek_formatted_abstract && publication.rek_formatted_abstract.replace(/&nbsp;/g, ' ')) ||
                  (publication.rek_description && publication.rek_description.replace(/&nbsp;/g, ' ')) ||
                  null;
    };

    const renderRow = (heading, data, index, field) => {
        const labelTestId = `${field.replace(/_/g, '-')}-label`;
        return (
            <Box
                sx={theme => ({
                    padding: { xs: `${theme.spacing(1)} 0`, sm: 1 },
                    borderBottom: '1px solid',
                    borderBottomColor: 'secondary.light',
                })}
                key={index}
            >
                <Grid
                    container
                    spacing={2}
                    key={`additional-info-${heading}`}
                    sx={{
                        padding: 0,
                        alignItems: 'flex-start',
                    }}
                >
                    <Grid
                        size={{
                            xs: 12,
                            sm: 3,
                        }}
                    >
                        <Typography variant="body2" component={'span'} data-testid={labelTestId}>
                            {heading}
                        </Typography>
                    </Grid>
                    <Grid
                        size={{
                            xs: 12,
                            sm: 9,
                        }}
                    >
                        <Typography variant="body2" component={'span'}>
                            {data}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        );
    };

    // title/description/abstract have been sanitized in middleware
    const renderHTML = data => {
        return parseHtmlToJSX(data);
    };

    const renderLink = (link, value, testId = '', icon = '', iconHint = '') => {
        return (
            <Link to={link} {...{ ['data-testid']: testId || undefined }}>
                {value}
                {icon && (
                    <Tooltip title={iconHint}>
                        <span className={`fez-icon ${icon} medium`} style={{ margin: '0 4px' }} />
                    </Tooltip>
                )}
            </Link>
        );
    };

    const renderList = (list, subkey, getLink) => {
        const testId = subkey.replace(/_/g, '-');
        return (
            <Box component={'ul'} key={subkey} sx={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                {list.map((item, index) => (
                    <li key={`${testId}-${index}`} data-testid={`${testId}-${index}`}>
                        {(() => {
                            const data = getData(item, subkey);
                            if (getLink) {
                                const firstTwo = subkey.split('_').slice(0, 2).join('_');
                                const icon = item[firstTwo + '_icon'] ?? '';
                                console.log('item[subkey]', item[subkey], 'data', data);
                                console.log('getLink(item[subkey], data)', getLink(item[subkey], data));
                                const iconHint =
                                    icon === 'openalex'
                                        ? 'OpenAlex'
                                        : icon.charAt(0).toUpperCase() + icon.slice(1).toLowerCase();
                                return renderLink(getLink(item[subkey], data), data, '', icon, iconHint);
                            } else {
                                return data;
                            }
                        })()}
                    </li>
                ))}
            </Box>
        );
    };

    const renderTitle = () => {
        return renderHTML(publication.rek_formatted_title ? publication.rek_formatted_title : publication.rek_title);
    };

    const renderLicense = (cvoId, lookup) => {
        const licenseLookup = renderLink(pathConfig.list.license(lookup), lookup, 'rek-license-lookup');
        const licenseLink = viewRecordsConfig.licenseLinks[cvoId] ? viewRecordsConfig.licenseLinks[cvoId] : null;
        const uqLicenseLinkText =
            licenseLink && licenseLink.className.indexOf('uq') === 0
                ? locale.viewRecord.sections.additionalInformation.license.link.text
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

    const renderCulturalInstitutionNotice = () => {
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

    const renderJournalName = () => {
        return <JournalName publication={publication} />;
    };

    const renderContributors = publication => {
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

    const renderMap = coordinatesList => {
        if (coordinatesList.length === 0 || !coordinatesList[0].rek_geographic_area) {
            return <span />;
        }
        /*
         *  New map doesn't support the dynamic google URLs. e.g. GOOGLE_MAPS_API_CHINA_URL
         */
        return <PublicationMap coordinates={coordinatesList[0].rek_geographic_area} readOnly />;
    };

    const renderDoi = doi => {
        return doi ? <DoiCitationView key="additional-information-doi" doi={doi} /> : null;
    };

    // TODO: display original contact email for admin users
    const renderContactEmail = (objects, subKey) => {
        const isInstrument = publication.rek_display_type === PUBLICATION_TYPE_INSTRUMENT;
        const email = isInstrument ? objects[0][subKey] : viewRecordsConfig.genericDataEmail;
        return (
            <a href={`mailto:${email}`} data-testid="rek-contact-details-email">
                {email}
            </a>
        );
    };

    const renderContributorIdentifier = (objects, subKey) => {
        const id = objects[0][subKey];
        let link = null;

        if (isValidOrcid(id)) {
            link = `${ORCID_BASE_URL}/${id}`;
        } else {
            /* istanbul ignore else */
            if (isValidROR(id)) {
                link = `${ROR_BASE_URL}/${id}`;
            }
        }

        return link ? (
            <ExternalLink id={'rek-contributor-identifier'} data-testid={'rek-contributor-identifier'} href={link}>
                {id}
            </ExternalLink>
        ) : (
            id
        );
    };

    const renderAlternateIdentifier = publication => {
        const ids = publication.fez_record_search_key_alternate_identifier;
        return (
            <Box component={'ul'} key={'alternate-identifier'} sx={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                {ids.map((item, index) => (
                    <li key={`alternate-identifier-${index}`} data-testid={`alternate-identifier-${index}`}>
                        {(() => {
                            const identifier = item.rek_alternate_identifier;
                            const order = item.rek_alternate_identifier_order;
                            const typeObject = publication.fez_record_search_key_alternate_identifier_type?.find(
                                identifierType => identifierType.rek_alternate_identifier_type_order === order,
                            );

                            if (typeObject) {
                                const identifierType = getData(typeObject, 'rek_alternate_identifier_type');
                                return `${identifier} (${identifierType})`;
                            } else {
                                return identifier;
                            }
                        })()}
                    </li>
                ))}
            </Box>
        );
    };

    const transformFieldNameToSubkey = field => {
        const keyPrefix = 'fez_record_search_key_';
        const subkeyPrefix = 'rek_';
        return field.indexOf(keyPrefix) === 0 ? subkeyPrefix + field.substring(keyPrefix.length) : null;
    };

    const isDatePlaceholder = value => moment(value).isSame(moment(PLACEHOLDER_ISO8601_ZULU_DATE));

    const getCINoticeValue = publication => {
        return !!publication.rek_ci_notice_attribution_incomplete &&
            publication.rek_ci_notice_attribution_incomplete === 1
            ? [true]
            : null;
    };

    const excludeAdminOnlyFields = fields => {
        return fields.filter(item => !locale.viewRecord.adminFields.includes(item.field));
    };

    const getFieldHeading = (displayTypeHeadings, headings, field, isNtro) => {
        if (displayTypeHeadings[field]) {
            return typeof displayTypeHeadings[field] === 'function'
                ? displayTypeHeadings[field](isNtro && publication.rek_subtype !== NTRO_SUBTYPE_CW_TEXTUAL_WORK)
                : displayTypeHeadings[field];
        } else {
            return headings.default[field];
        }
    };

    const renderSDG = publication => {
        const { fez_record_search_key_sdg: sdg, fez_record_search_key_sdg_source: sdgSource } = publication;
        /* istanbul ignore next */
        if (!sdg?.length || !sdgSource?.length) {
            return null;
        }
        const link = locale.viewRecord.sections.additionalInformation.sdg.link;

        return (
            <>
                <Box component={'ul'} key="rek-sdg" sx={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                    {sdg
                        .sort((a, b) => a.rek_sdg - b.rek_sdg)
                        .map((item, index) => {
                            /* istanbul ignore next */
                            if (!item?.rek_sdg || !item?.rek_sdg_lookup) return null;
                            return (
                                <li
                                    key={`rek-sdg-${item.rek_sdg}-${index}`}
                                    data-testid={`rek-sdg-${item.rek_sdg}-${index}`}
                                >
                                    <span style={{ marginRight: '2px' }}>
                                        {renderLink(
                                            pathConfig.list.sustainableDevelopmentGoal(
                                                item.rek_sdg,
                                                item.rek_sdg_lookup,
                                            ),
                                            item.rek_sdg_lookup,
                                        )}
                                    </span>
                                    {sdgSource
                                        .sort((a, b) => a.rek_sdg_source - b.rek_sdg_source)
                                        .map((source, index) => {
                                            /* istanbul ignore next */
                                            if (
                                                !source?.rek_sdg_source ||
                                                !source?.rek_sdg_source_lookup ||
                                                source?.sdg?.cvo_id !== item.rek_sdg
                                            ) {
                                                return null;
                                            }
                                            const icon = source.rek_sdg_source_lookup.toLowerCase?.().trim();
                                            /* istanbul ignore next */
                                            if (!icon) return null;
                                            return (
                                                <Tooltip title={source.rek_sdg_source_lookup}>
                                                    <span
                                                        key={`rek-sdg-source-${item.rek_sdg}-${source.rek_sdg_source}-${index}`}
                                                        data-testid={`rek-sdg-source-${item.rek_sdg}-${source.rek_sdg_source}-${index}`}
                                                        className={`fez-icon ${icon} medium`}
                                                        style={{ margin: '0 4px' }}
                                                    />
                                                </Tooltip>
                                            );
                                        })}
                                </li>
                            );
                        })}
                </Box>
                <p />
                <ExternalLink href={link.url} openInNewIcon id="rek-sdg">
                    {link.text}
                </ExternalLink>
            </>
        );
    };

    const renderObjectList = (objects, subkey, publication) => {
        switch (subkey) {
            case 'rek_alternate_identifier':
                return renderAlternateIdentifier(publication);
            case 'rek_author':
                return renderAuthors(publication);
            case 'rek_contributor':
                return renderContributors(publication);
            case 'rek_keywords':
                return renderList(objects, subkey, pathConfig.list.keyword);
            case 'rek_seo_code':
                return renderList(objects, subkey, pathConfig.list.subject);
            case 'rek_alternate_genre':
                return renderList(objects, subkey, pathConfig.list.subject);
            case 'rek_contact_details_email':
                return renderContactEmail(objects, subkey);
            case 'rek_contributor_identifier':
                return renderContributorIdentifier(objects, subkey);
            case 'rek_geographic_area':
                return renderMap(objects);
            case 'rek_raid':
                return renderList(objects, subkey, pathConfig.list.raid);
            case 'rek_subject':
                return renderList(objects, subkey, pathConfig.list.subject);
            case 'rek_sdg_source':
                return renderSDG(publication);
            default:
                return renderList(objects, subkey);
        }
    };

    // render a single object (without order field)
    const renderObject = (object, subkey) => {
        const data = getData(object, subkey);

        // date fields
        if (viewRecordsConfig.dateFields.includes(subkey)) {
            return formatDate(data, viewRecordsConfig.dateFieldFormat[subkey]);
        }

        // title/description/abstract have been sanitized in middleware
        const renderHTML = data => {
            return parseHtmlToJSX(data);
        };

        // html fields
        if (viewRecordsConfig.htmlFields.includes(subkey)) {
            return renderHTML(data);
        }

        const testId = subkey.replace(/_/g, '-');
        switch (subkey) {
            case 'rek_doi':
                return renderDoi(data);
            case 'rek_journal_name':
                return renderJournalName();
            case 'rek_publisher':
                return renderLink(pathConfig.list.publisher(data), data, testId);
            case 'rek_herdc_code':
                return renderLink(pathConfig.list.herdcStatus(object[subkey]), data, testId);
            case 'rek_herdc_status':
                return renderLink(pathConfig.list.herdcStatus(object[`${subkey}_lookup`]), data, testId);
            case 'rek_ands_collection_type':
            case 'rek_access_conditions':
                return !!data && <span data-testid={testId}>{data}</span>;
            case 'rek_series':
                return renderLink(pathConfig.list.series(object[subkey]), object[subkey], testId);
            case 'rek_license':
                return renderLicense(object[subkey], data);
            case 'rek_org_unit_name':
                return renderLink(pathConfig.list.orgUnitName(data), data, testId);
            case 'rek_institutional_status':
                return renderLink(pathConfig.list.institutionalStatus(object[`${subkey}_lookup`]), data, testId);
            case 'rek_book_title':
                return renderLink(pathConfig.list.bookTitle(object[subkey]), data, testId);
            case 'rek_job_number':
                return renderLink(pathConfig.list.jobNumber(object[subkey]), data, testId);
            case 'rek_conference_name':
                return renderLink(pathConfig.list.conferenceName(object[subkey]), data, testId);
            case 'rek_proceedings_title':
                return renderLink(pathConfig.list.proceedingsTitle(object[subkey]), data, testId);
            default:
                return <span data-testid={testId}>{data}</span>;
        }
    };

    // render rek fields from fez_record_search_key
    const renderContent = (key, value) => {
        let renderedValue;
        switch (key) {
            case 'rek_title':
                renderedValue = renderTitle();
                break;
            case 'rek_date':
                // case 'rek_start_date':
                // case 'rek_end_date':
                renderedValue = formatPublicationDate(value, publication.rek_display_type_lookup);
                break;
            case 'rek_description':
                renderedValue = renderHTML(value);
                break;
            case 'rek_ci_notice_attribution_incomplete':
                renderedValue = renderCulturalInstitutionNotice();
                break;
            default:
                renderedValue = value;
        }
        return <span data-testid={key.replace(/_/g, '-')}>{renderedValue}</span>;
    };

    const renderColumns = () => {
        const rows = [];

        const displayType = publication.rek_display_type_lookup;
        const headings = locale.viewRecord.headings;
        const displayTypeHeadings = displayType && headings[displayType] ? headings[displayType] : [];
        const footerFields = locale.viewRecord.fields.footer;
        let fields =
            displayType && locale.viewRecord.fields[displayType]
                ? locale.viewRecord.fields[displayType].concat(footerFields)
                : footerFields;
        fields = account && account.canMasquerade ? fields : excludeAdminOnlyFields(fields);

        fields
            .sort((field1, field2) => field1.order - field2.order)
            .map((item, index) => {
                let data = '';
                const field = item.field;
                let value;
                let subkey;
                switch (field) {
                    case 'rek_description':
                        value = getAbstract(publication);
                        break;
                    case 'rek_date':
                        value = isDatePlaceholder(publication[field]) ? null : publication[field];
                        break;
                    case 'fez_record_search_key_start_date':
                    case 'fez_record_search_key_end_date':
                        subkey = transformFieldNameToSubkey(field);
                        value =
                            publication[field] &&
                            publication[field][subkey] &&
                            isDatePlaceholder(publication[field][subkey])
                                ? null
                                : publication[field];
                        break;
                    case 'rek_ci_notice_attribution_incomplete':
                        value = getCINoticeValue(publication);
                        break;
                    case 'fez_record_search_key_herdc_code':
                        subkey = transformFieldNameToSubkey(field);
                        value = publication[field] && publication[field][subkey] !== 0 ? publication[field] : null;
                        break;
                    default:
                        value = publication[field];
                }

                // do not display field when value is null, empty array
                if (value && Object.keys(value).length > 0) {
                    const subkey = transformFieldNameToSubkey(field);
                    const heading = getFieldHeading(displayTypeHeadings, headings, field, isNtro);

                    // logic to get values from fez_record_search_key fields
                    if (subkey) {
                        data = Array.isArray(value)
                            ? renderObjectList(value, subkey, publication)
                            : renderObject(value, subkey);
                    } else {
                        data = renderContent(field, value);
                    }

                    if (data) {
                        rows.push(renderRow(heading, data, index, subkey || field));
                    }
                }
            });

        return rows;
    };

    if (!publication || !publication.rek_display_type_lookup) {
        return null;
    }
    return (
        <Grid size={{ xs: 12 }}>
            <StandardCard title={locale.viewRecord.sections.additionalInformation.title}>
                {renderColumns()}
            </StandardCard>
        </Grid>
    );
};
AdditionalInformation.propTypes = {
    account: PropTypes.object,
    publication: PropTypes.object.isRequired,
    isNtro: PropTypes.bool,
};

export default AdditionalInformation;
