import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import { default as global } from 'locale/global';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { general } from 'config';
import { parseHtmlToJSX } from 'helpers/general';
import {
    NTRO_SUBTYPE_CW_TEXTUAL_WORK,
    DOCUMENT_TYPE_JOURNAL_ARTICLE,
    DOCUMENT_TYPE_BOOK_CHAPTER,
    DOCUMENT_TYPE_BOOK,
    DOCUMENT_TYPE_RESEARCH_REPORT,
} from 'config/general';

export class NtroDetails extends PureComponent {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        classes: PropTypes.object,
        account: PropTypes.object,
    };

    ViewNtroRow = ({ heading, subheading, sx = {}, data, rowId }) => (
        <Box sx={theme => ({ padding: { xs: `${theme.spacing(1)} 0`, sm: theme.spacing(1) } })}>
            <Grid
                container
                spacing={2}
                padding={0}
                sx={{ borderBottom: '1px solid', borderBottomColor: 'secondary.light' }}
                alignItems="flex-start"
            >
                <Grid item xs={12} sm={3} data-testid={`${rowId}-label`}>
                    <Typography
                        variant="body2"
                        component={'span'}
                        classes={{ root: this.props.classes?.header }}
                        data-testid={`${rowId}-label-0`}
                    >
                        {heading}
                    </Typography>
                    {!!subheading && (
                        <Typography
                            variant="caption"
                            component={'span'}
                            classes={{ root: this.props.classes?.header }}
                            data-testid={`${rowId}-label-1`}
                        >
                            {subheading}
                        </Typography>
                    )}
                </Grid>
                <Grid item xs={12} sm={9}>
                    <Typography variant="body2" component={'span'} sx={{ ...sx }} data-testid={rowId}>
                        {data}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );

    render() {
        const { publication } = this.props;
        const docType = publication.rek_display_type_lookup;
        const subType = publication.rek_subtype;
        if (!general.NTRO_SUBTYPES.includes(subType)) {
            return null;
        }
        return (
            <Grid item xs={12}>
                <StandardCard title={locale.viewRecord.sections.ntro.title}>
                    {/* Significance */}
                    {publication.fez_record_search_key_author &&
                        publication.fez_record_search_key_author.length > 0 &&
                        publication.fez_record_search_key_significance &&
                        publication.fez_record_search_key_significance.length > 0 &&
                        publication.fez_record_search_key_significance.map((item, index) => {
                            if (
                                (this.props.account && this.props.account.canMasquerade) ||
                                (item.rek_significance && item.rek_significance !== '') ||
                                item.rek_significance === 0
                            ) {
                                return (
                                    <this.ViewNtroRow
                                        key={index}
                                        heading={`${locale.viewRecord.headings.NTRO.significance}`}
                                        subheading={`(${
                                            (
                                                publication.fez_record_search_key_author[
                                                    item.rek_significance_order - 1
                                                ] || {}
                                            ).rek_author
                                                ? publication.fez_record_search_key_author[
                                                      item.rek_significance_order - 1
                                                  ].rek_author
                                                : ''
                                        })`}
                                        data={
                                            (item.rek_significance !== 0 &&
                                                item.rek_significance !== '0' &&
                                                !!item.rek_significance &&
                                                item.rek_significance_lookup) ||
                                            global.global.defaultAuthorDataPlaceholder
                                        }
                                        rowId={`rek-significance-${index}`}
                                    />
                                );
                            } else {
                                return null;
                            }
                        })}
                    {/* Contribution statement */}
                    {publication.fez_record_search_key_author &&
                        publication.fez_record_search_key_author.length > 0 &&
                        publication.fez_record_search_key_creator_contribution_statement &&
                        publication.fez_record_search_key_creator_contribution_statement.length > 0 &&
                        publication.fez_record_search_key_creator_contribution_statement.map((item, index) => {
                            if (
                                (this.props.account && this.props.account.canMasquerade) ||
                                (item.rek_creator_contribution_statement &&
                                    item.rek_creator_contribution_statement !== '' &&
                                    item.rek_creator_contribution_statement.length > 0 &&
                                    item.rek_creator_contribution_statement.trim().length !== 0) ||
                                item.rek_creator_contribution_statement === null
                            ) {
                                return (
                                    <this.ViewNtroRow
                                        sx={{
                                            '& p:first-of-type': {
                                                marginTop: 0,
                                            },
                                        }}
                                        key={index}
                                        heading={locale.viewRecord.headings.NTRO.impactStatement}
                                        subheading={
                                            (
                                                publication.fez_record_search_key_author[
                                                    item.rek_creator_contribution_statement_order - 1
                                                ] || {}
                                            ).rek_author
                                                ? `(${
                                                      publication.fez_record_search_key_author[
                                                          item.rek_creator_contribution_statement_order - 1
                                                      ].rek_author
                                                  })`
                                                : ''
                                        }
                                        data={
                                            (item.rek_creator_contribution_statement &&
                                                item.rek_creator_contribution_statement.trim().length !== 0 &&
                                                parseHtmlToJSX(item.rek_creator_contribution_statement)) ||
                                            global.global.defaultAuthorDataPlaceholder
                                        }
                                        rowId={`rek-creator-contribution-statement-${index}`}
                                    />
                                );
                            } else {
                                return null;
                            }
                        })}
                    {/* NTRO Abstract */}
                    {(!!publication.rek_formatted_abstract || !!publication.rek_description) &&
                        (!!publication.rek_formatted_abstract ? (
                            <this.ViewNtroRow
                                sx={{
                                    '& p:first-of-type': {
                                        marginTop: 0,
                                    },
                                }}
                                heading={locale.viewRecord.headings.NTRO.ntroAbstract}
                                data={parseHtmlToJSX(publication.rek_formatted_abstract)}
                                rowId="rek-formatted-abstract"
                            />
                        ) : (
                            <this.ViewNtroRow
                                heading={locale.viewRecord.headings.NTRO.ntroAbstract}
                                data={publication.rek_description}
                                rowId="rek-description"
                            />
                        ))}
                    {/* ISMN */}
                    {publication.fez_record_search_key_ismn && publication.fez_record_search_key_ismn.length > 0 && (
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.fez_record_search_key_ismn}
                            data={publication.fez_record_search_key_ismn.map((item, index) => {
                                return (
                                    <span key={index} data-testid={`rek-ismn-${index}`}>
                                        {item.rek_ismn}
                                        {publication.fez_record_search_key_ismn.length > 1 &&
                                            index < publication.fez_record_search_key_ismn.length - 1 && <br />}
                                    </span>
                                );
                            })}
                            rowId="rek-ismn"
                        />
                    )}
                    {/* ISRC */}
                    {publication.fez_record_search_key_isrc && publication.fez_record_search_key_isrc.length > 0 && (
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.fez_record_search_key_isrc}
                            data={publication.fez_record_search_key_isrc.map((item, index) => {
                                return (
                                    <span key={index} data-testid={`rek-isrc-${index}`}>
                                        {item.rek_isrc}
                                        {publication.fez_record_search_key_isrc.length > 1 &&
                                            index < publication.fez_record_search_key_isrc.length - 1 && <br />}
                                    </span>
                                );
                            })}
                            rowId="rek-isrc"
                        />
                    )}
                    {/* Volume number */}
                    {docType !== DOCUMENT_TYPE_JOURNAL_ARTICLE &&
                        subType !== NTRO_SUBTYPE_CW_TEXTUAL_WORK &&
                        publication.fez_record_search_key_volume_number &&
                        publication.fez_record_search_key_volume_number.rek_volume_number && (
                            <this.ViewNtroRow
                                heading={locale.viewRecord.headings.NTRO.rek_volume_number}
                                data={publication.fez_record_search_key_volume_number.rek_volume_number}
                                rowId="rek-description"
                            />
                        )}
                    {/* Issue number */}
                    {docType !== DOCUMENT_TYPE_JOURNAL_ARTICLE &&
                        subType !== NTRO_SUBTYPE_CW_TEXTUAL_WORK &&
                        publication.fez_record_search_key_issue_number &&
                        publication.fez_record_search_key_issue_number.rek_issue_number && (
                            <this.ViewNtroRow
                                heading={locale.viewRecord.headings.NTRO.rek_issue_number}
                                data={publication.fez_record_search_key_issue_number.rek_issue_number}
                                rowId="rek-issue-number"
                            />
                        )}
                    {/* Start page */}
                    {docType !== DOCUMENT_TYPE_JOURNAL_ARTICLE &&
                        subType !== NTRO_SUBTYPE_CW_TEXTUAL_WORK &&
                        docType !== DOCUMENT_TYPE_BOOK_CHAPTER &&
                        publication.fez_record_search_key_start_page &&
                        publication.fez_record_search_key_start_page.rek_start_page && (
                            <this.ViewNtroRow
                                heading={locale.viewRecord.headings.NTRO.rek_start_page}
                                data={publication.fez_record_search_key_start_page.rek_start_page}
                                rowId="rek-start-page"
                            />
                        )}
                    {/* End page */}
                    {docType !== DOCUMENT_TYPE_JOURNAL_ARTICLE &&
                        subType !== NTRO_SUBTYPE_CW_TEXTUAL_WORK &&
                        docType !== DOCUMENT_TYPE_BOOK_CHAPTER &&
                        publication.fez_record_search_key_end_page &&
                        publication.fez_record_search_key_end_page.rek_end_page && (
                            <this.ViewNtroRow
                                heading={locale.viewRecord.headings.NTRO.rek_end_page}
                                data={publication.fez_record_search_key_end_page.rek_end_page}
                                rowId="rek-end-page"
                            />
                        )}
                    {/* Total pages */}
                    {docType !== DOCUMENT_TYPE_BOOK_CHAPTER &&
                        docType !== DOCUMENT_TYPE_BOOK &&
                        subType !== NTRO_SUBTYPE_CW_TEXTUAL_WORK &&
                        docType !== DOCUMENT_TYPE_RESEARCH_REPORT &&
                        publication.fez_record_search_key_total_pages &&
                        publication.fez_record_search_key_total_pages.rek_total_pages && (
                            <this.ViewNtroRow
                                heading={locale.viewRecord.headings.NTRO.rek_total_pages}
                                data={publication.fez_record_search_key_total_pages.rek_total_pages}
                                rowId="rek-total-pages"
                            />
                        )}

                    {/* Language */}
                    {publication.fez_record_search_key_language &&
                        publication.fez_record_search_key_language.length > 0 && (
                            <this.ViewNtroRow
                                heading={locale.viewRecord.headings.NTRO.rek_language}
                                data={publication.fez_record_search_key_language.map((item, index) => {
                                    return (
                                        <span key={index} data-testid={`rek-language-${index}`}>
                                            {general.LANGUAGE.filter(language => {
                                                return item.rek_language === language.value;
                                            }).map(language => {
                                                return language.text;
                                            })}
                                            {publication.fez_record_search_key_language.length > 1 &&
                                                index < publication.fez_record_search_key_language.length - 1 &&
                                                ', '}
                                        </span>
                                    );
                                })}
                                rowId="rek-language"
                            />
                        )}

                    {/* Original format */}
                    {publication.fez_record_search_key_original_format &&
                        publication.fez_record_search_key_original_format.rek_original_format && (
                            <this.ViewNtroRow
                                heading={locale.viewRecord.headings.NTRO.rek_original_format}
                                data={publication.fez_record_search_key_original_format.rek_original_format}
                                rowId="rek-original-format"
                            />
                        )}
                    {/* Audience size */}
                    {publication.fez_record_search_key_audience_size &&
                        publication.fez_record_search_key_audience_size.rek_audience_size && (
                            <this.ViewNtroRow
                                heading={locale.viewRecord.headings.NTRO.rek_audience_size}
                                data={
                                    publication.fez_record_search_key_audience_size.rek_audience_size_lookup ||
                                    'Not set'
                                }
                                rowId="rek-audience-size"
                            />
                        )}
                    {/* Quality indicators */}
                    {publication.fez_record_search_key_quality_indicator &&
                        publication.fez_record_search_key_quality_indicator.length > 0 && (
                            <this.ViewNtroRow
                                heading={locale.viewRecord.headings.NTRO.qualityIndicators}
                                data={publication.fez_record_search_key_quality_indicator.map(
                                    (item, index, fsrkqiArray) => (
                                        <React.Fragment key={index}>
                                            <span data-testid={`rek-content-indicator-${index}`}>
                                                {item.rek_quality_indicator_lookup || 'Not set'}
                                            </span>
                                            {index < fsrkqiArray.length - 1 && ', '}
                                        </React.Fragment>
                                    ),
                                )}
                                rowId="rek-quality-indicator"
                            />
                        )}
                </StandardCard>
            </Grid>
        );
    }
}

export default NtroDetails;
