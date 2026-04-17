import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';

import { formatPublicationDate } from 'modules/ViewRecord/components/AdditionalInformation';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { parseHtmlToJSX } from 'helpers/general';

export const renderAuthors = (authors, field) => {
    const subKey = field.replace('fez_record_search_key', 'rek');
    const testId = subKey.replace('_', '-');
    return (
        <Grid container spacing={2} data-testid={`${testId}-list`}>
            {authors.map((author, index) => (
                <Grid item xs={12} key={author[`${subKey}_id`]}>
                    <span data-testid={`${testId}-${index}`}>{author[subKey]}</span>
                    {!!author.aut_orcid_id && (
                        <React.Fragment>
                            {' (ORCID: '}
                            <ExternalLink
                                id={`${testId}-${index}-orcid-link`}
                                data-testid={`${testId}-${index}-orcid-link`}
                                href={`https://orcid.org/${author.aut_orcid_id}`}
                            >
                                {author.aut_orcid_id}
                            </ExternalLink>
                            )
                        </React.Fragment>
                    )}
                </Grid>
            ))}
        </Grid>
    );
};

export const DoiField = ({ data, field, label, displayTypeLookup }) => {
    let value = '';
    switch (field) {
        case 'fez_record_search_key_author':
        case 'fez_record_search_key_contributor':
            value = (!!data && data.length && renderAuthors(data, field)) || '';
            break;

        case 'rek_description':
        case 'rek_title':
            value = parseHtmlToJSX(data);
            break;

        case 'rek_date':
            value = formatPublicationDate(data, displayTypeLookup);
            break;
        case 'fez_record_search_key_start_date':
        case 'fez_record_search_key_end_date':
            const rekKey = field.replace('fez_record_search_key', 'rek');
            value = formatPublicationDate(data[rekKey], displayTypeLookup);
            break;

        // Arrays
        case 'fez_record_search_key_isbn':
        case 'fez_record_search_key_issn':
        case 'fez_record_search_key_instrument_type':
        case 'fez_record_search_key_measured_variable':
        case 'fez_record_search_key_alternate_identifier':
            if (!!data && data.length === 0) {
                break;
            }
            const subKey = field.replace('fez_record_search_key', 'rek');
            const testId = subKey.replace('_', '-');
            value = (
                <ul>
                    {data.map((item, index) => (
                        <li data-testid={`${testId}-${index}`} key={`${testId}-${item[`${subKey}_id`]}-${index}`}>
                            {item[subKey]}
                        </li>
                    ))}
                </ul>
            );
            break;

        // Single values
        case 'fez_record_search_key_conference_location':
        case 'fez_record_search_key_conference_name':
        case 'fez_record_search_key_end_page':
        case 'fez_record_search_key_issue_number':
        case 'fez_record_search_key_org_name':
        case 'fez_record_search_key_org_unit_name':
        case 'fez_record_search_key_parent_publication':
        case 'fez_record_search_key_place_of_publication':
        case 'fez_record_search_key_proceedings_title':
        case 'fez_record_search_key_publisher':
        case 'fez_record_search_key_report_number':
        case 'fez_record_search_key_resource_type':
        case 'fez_record_search_key_series':
        case 'fez_record_search_key_start_page':
        case 'fez_record_search_key_volume_number':
            value = !!data && data[field.replace('fez_record_search_key', 'rek')];
            if (field === 'fez_record_search_key_series' && !!value) {
                value = value.split(';')[0].split(': no')[0];
            }
            break;

        case 'fez_record_search_key_edition':
            value = !!data && data[field.replace('fez_record_search_key', 'rek')];
            if (!!value && !/^\d+$/.test(value.trim())) {
                value = '';
            }
            break;

        case 'rek_author-name':
        case 'rek_doi':
        case 'rek_genre_type':
            value = data;
            break;

        case 'rek_author-email':
            value = <a href={`mailto:${data}`}>{data}</a>;
            break;

        default:
            value = !!data && <pre>{JSON.stringify(data, null, 2)}</pre>;
            break;
    }

    if (!value) {
        return '';
    }

    const testId = field.replace('fez_record_search_key', 'rek').replace(/_/g, '-');

    return (
        <Grid
            container
            key={field}
            spacing={2}
            sx={{ borderBottom: '1px solid secondary.light', marginBottom: '1rem' }}
        >
            <Grid item xs={12} sm={3}>
                <Typography variant="body2" component={'span'} data-testid={`${testId}-label`}>
                    {label}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={9}>
                <Typography variant="body2" component={'span'} data-testid={`${testId}`}>
                    {value}
                </Typography>
            </Grid>
        </Grid>
    );
};

DoiField.propTypes = {
    classes: PropTypes.object,
    data: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
    displayTypeLookup: PropTypes.string,
    field: PropTypes.string,
    label: PropTypes.string,
};

export default DoiField;
