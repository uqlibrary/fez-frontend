import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import DoiField from './DoiField';

import locale from 'locale/viewRecord';
import pagesLocale from 'locale/pages';
import { doiFields } from 'config/doi';

export const DoiPreview = ({ author, publication }) => {
    const displayType = publication.rek_display_type;
    const displayTypeLookup = publication.rek_display_type_lookup;
    const fields = displayType && doiFields[displayType] && doiFields[displayType].fields;

    if (!fields) {
        return '';
    }

    const headings = locale.viewRecord.headings;
    const displayTypeHeadings = displayTypeLookup && headings[displayTypeLookup] ? headings[displayTypeLookup] : [];

    const recordFields = fields
        .sort((field1, field2) => field1.order - field2.order)
        .map(({ field }) => {
            let data = publication[field];
            if (field === 'fez_record_search_key_author') {
                data = data.map((author, index) => ({
                    ...author,
                    aut_orcid_id:
                        publication.fez_record_search_key_author_id[index] &&
                        publication.fez_record_search_key_author_id[index].author &&
                        publication.fez_record_search_key_author_id[index].author.aut_orcid_id,
                }));
            }
            const componentProps = {
                heading: displayTypeHeadings[field] ? displayTypeHeadings[field] : headings.default[field],
                field,
                data,
                key: field,
            };
            return <DoiField {...componentProps} />;
        });

    const txt = pagesLocale.pages.doi;
    const doi =
        !!publication && !!publication.fez_record_search_key_doi && publication.fez_record_search_key_doi.rek_doi;

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <StandardCard title={txt.cardTitles.doi}>
                    <DoiField
                        heading={txt.doiHeading(!!doi)}
                        field="doi"
                        data={doi || txt.doiTemplate(publication.rek_pid)}
                    />
                </StandardCard>
            </Grid>
            <Grid item xs={12}>
                <StandardCard title={txt.cardTitles.depositor}>
                    <DoiField heading={txt.depositorNameTitle} field="depositorName" data={author.aut_display_name} />
                    <DoiField heading={txt.depositorEmailTitle} field="depositorEmail" data={author.aut_email} />
                </StandardCard>
            </Grid>
            <Grid item xs={12}>
                <StandardCard title={txt.cardTitles.work}>{recordFields}</StandardCard>
            </Grid>
        </Grid>
    );
};

DoiPreview.propTypes = {
    author: PropTypes.object,
    publication: PropTypes.object,
};

export default DoiPreview;
