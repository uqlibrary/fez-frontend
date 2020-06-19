import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { formatPublicationDate } from 'modules/ViewRecord/components/AdditionalInformation';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

export const useStyles = makeStyles(theme => ({
    gridRow: {
        borderBottom: `1px solid ${theme.palette.secondary.light}`,
        marginBottom: '1rem',
    },
}));

export const renderAuthors = authors => {
    return (
        <Grid container spacing={2}>
            {authors.map((author, index) => (
                <Grid item xs={12} key={author.rek_author_id} data-testid={`author-${index}`}>
                    {author.rek_author}
                    {!!author.aut_orcid_id && (
                        <React.Fragment>
                            {' (ORCID: '}
                            <ExternalLink
                                id={`author-${index}-orcid-link`}
                                data-testid={`author-${index}-orcid-link`}
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

export const DoiField = ({ data, field, heading }) => {
    const classes = useStyles();

    let value = '';
    switch (field) {
        case 'fez_record_search_key_author':
            value = renderAuthors(data);
            break;

        case 'rek_title':
            value = ReactHtmlParser(data);
            break;

        case 'rek_date':
            value = formatPublicationDate(data);
            break;

        // Arrays
        case 'fez_record_search_key_isbn':
        case 'fez_record_search_key_issn':
            const subKey = field.replace('fez_record_search_key', 'rek');
            value = data.map(item => item[subKey]).join(', ');
            break;

        // Single values
        case 'fez_record_search_key_end_page':
        case 'fez_record_search_key_place_of_publication':
        case 'fez_record_search_key_publisher':
        case 'fez_record_search_key_report_number':
        case 'fez_record_search_key_start_page':
            value = !!data && data[field.replace('fez_record_search_key', 'rek')];
            break;

        case 'doi':
        case 'depositorName':
            value = data;
            break;

        case 'depositorEmail':
            value = <a href={`mailto:${data}`}>{data}</a>;
            break;

        default:
            value = !!data && <pre>{JSON.stringify(data, null, 2)}</pre>;
            break;
    }

    if (!value) {
        return '';
    }

    return (
        <Grid container key={field} spacing={2} classes={{ root: classes.gridRow }}>
            <Grid item xs={12} sm={3}>
                <Typography variant="body2" component={'span'} data-testid={`${field}-heading`}>
                    {heading}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={9}>
                <Typography variant="body2" component={'span'} data-testid={`${field}-value`}>
                    {value}
                </Typography>
            </Grid>
        </Grid>
    );
};

DoiField.propTypes = {
    classes: PropTypes.object,
    data: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
    field: PropTypes.string,
    heading: PropTypes.string,
};

export default DoiField;
