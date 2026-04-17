import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/GridLegacy';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import DoiField from './DoiField';

import locale from 'locale/viewRecord';
import pagesLocale from 'locale/pages';
import { doiFields } from 'config/doi';

import { validation } from 'config';
import { isArrayValid } from './Doi';

import { useAccountContext } from 'context';

export const DoiPreview = ({ publication }) => {
    const { account } = useAccountContext();
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
        .map(({ field, needsSeriesForVisibility, needsIssnForVisibility }) => {
            let data = publication[field];
            if (!data) {
                return '';
            }

            switch (field) {
                case 'fez_record_search_key_author':
                    data = data.map((author, index) => ({
                        ...author,
                        aut_orcid_id:
                            publication.fez_record_search_key_author_id[index] &&
                            publication.fez_record_search_key_author_id[index].author &&
                            publication.fez_record_search_key_author_id[index].author.aut_orcid_id,
                    }));
                    break;

                case 'fez_record_search_key_issn':
                    if (
                        needsSeriesForVisibility &&
                        (!publication.fez_record_search_key_series ||
                            !publication.fez_record_search_key_series.rek_series)
                    ) {
                        return '';
                    }
                    break;

                case 'fez_record_search_key_parent_publication':
                    const startPage =
                        !!publication.fez_record_search_key_start_page &&
                        publication.fez_record_search_key_start_page.rek_start_page;
                    if (!/^\d+$/.test(startPage) || parseInt(startPage, 10) <= 1) {
                        return '';
                    }
                    break;

                case 'fez_record_search_key_series':
                    if (
                        needsIssnForVisibility &&
                        (!publication.fez_record_search_key_issn ||
                            !Array.isArray(publication.fez_record_search_key_issn) ||
                            publication.fez_record_search_key_issn.length === 0 ||
                            !isArrayValid(
                                publication,
                                { field: 'fez_record_search_key_issn' },
                                value => validation.isValidIssn(value) === '',
                            ))
                    ) {
                        return '';
                    }
                    break;

                default:
                    break;
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
                        data={doi || txt.doiTemplate(publication.rek_pid, publication.rek_display_type)}
                    />
                </StandardCard>
            </Grid>
            <Grid item xs={12}>
                <StandardCard title={txt.cardTitles.depositor}>
                    <DoiField label={txt.depositorNameTitle} field="rek_author-name" data={account.full_name} />
                    <DoiField label={txt.depositorEmailTitle} field="rek_author-email" data={account.email} />
                </StandardCard>
            </Grid>
            <Grid item xs={12}>
                <StandardCard title={txt.cardTitles.work}>{previewFields}</StandardCard>
            </Grid>
        </Grid>
    );
};

DoiPreview.propTypes = {
    authorDetails: PropTypes.object,
    publication: PropTypes.object,
};

export default DoiPreview;
