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
    const fieldConfig = displayType && doiFields[displayType] && doiFields[displayType].fields;

    if (!fieldConfig) {
        return '';
    }

    const headings = locale.viewRecord.headings;
    const displayTypeHeadings = displayTypeLookup && headings[displayTypeLookup] ? headings[displayTypeLookup] : [];

    const previewFields = fieldConfig
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
                data,
                displayTypeLookup,
                field,
                key: field,
                label: displayTypeHeadings[field] ? displayTypeHeadings[field] : headings.default[field],
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
                        label={!!doi ? txt.doiLabel.hasDoi : txt.doiLabel.noDoi}
                        field="rek_doi"
                        data={doi || txt.doiTemplate(publication.rek_pid)}
                    />
                </StandardCard>
            </Grid>
            <Grid item xs={12}>
                <StandardCard title={txt.cardTitles.depositor}>
                    <DoiField label={txt.depositorNameTitle} field="rek_author-name" data={author.aut_display_name} />
                    <DoiField label={txt.depositorEmailTitle} field="rek_author-email" data={author.aut_email} />
                </StandardCard>
            </Grid>
            <Grid item xs={12}>
                <StandardCard title={txt.cardTitles.work}>{previewFields}</StandardCard>
            </Grid>
        </Grid>
    );
};

DoiPreview.propTypes = {
    author: PropTypes.object,
    publication: PropTypes.object,
};

export default DoiPreview;
