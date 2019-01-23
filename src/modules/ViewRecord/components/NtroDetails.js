import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {general} from 'config';
import ReactHtmlParser from 'react-html-parser';

const styles = (theme) => ({
    gridRow: {
        borderBottom: `1px solid ${theme.palette.secondary.light}`
    }
});

export class NtroDetails extends PureComponent {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        classes: PropTypes.object,
        account: PropTypes.object
    };

    ViewNtroRow = ({heading, data}) => (
        <div style={{padding: 8}}>
            <Grid container spacing={16} className={this.props.classes.gridRow} alignItems="flex-start">
                <Grid item xs={12} sm={3}>
                    <Typography variant="body2" component={'span'} classes={{root: this.props.classes.header}}>{heading}</Typography>
                </Grid>
                <Grid item xs={12} sm={9} className={this.props.classes.data}>
                    <Typography variant="body2" component={'span'}>{data}</Typography></Grid>
            </Grid>
        </div>
    );

    render() {
        const {publication} = this.props;
        console.log(this.props);
        if (!general.NTRO_SUBTYPES.includes(publication.rek_subtype)) {
            return null;
        }

        return (
            <Grid item xs={12}>
                <StandardCard title={locale.viewRecord.sections.ntro.title}>
                    {/* Scale of work */}
                    {
                        publication.fez_record_search_key_significance && publication.fez_record_search_key_significance.length > 0 &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.significance}
                            data={publication.fez_record_search_key_significance[0].rek_significance === general.SIGNIFICANCE_MINOR ? 'Minor' : 'Major'}
                        />
                    }
                    {/* Contribution statement */}
                    {
                        publication.fez_record_search_key_creator_contribution_statement && publication.fez_record_search_key_creator_contribution_statement.length > 0 &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.impactStatement}
                            data={
                                publication.fez_record_search_key_creator_contribution_statement.map((item, index) => {
                                    // Admins will see all statements in the record
                                    if(!!this.props.account.canMasquerade && item.rek_creator_contribution_statement.trim().length !== 0) {
                                        return (
                                            <Grid container key={index} alignContent={'flex-start'} alignItems={'flex-start'} justify={'flex-start'}>
                                                <Grid item xs={'auto'} style={{marginRight: 12}}>
                                                    <p>{publication.fez_record_search_key_author_id[index].rek_author_id_lookup}</p>
                                                </Grid>
                                                <Grid item xs>
                                                    {ReactHtmlParser(item.rek_creator_contribution_statement)}
                                                </Grid>
                                            </Grid>
                                        );
                                        // Otherwise, we only show the 1 that is populated
                                    } else if (item.rek_creator_contribution_statement.trim().length !== 0) {
                                        return ReactHtmlParser(item.rek_creator_contribution_statement);
                                    } else {
                                        return null;
                                    }
                                })
                            }
                        />
                    }
                    {/* NTRO Abstract */}
                    {
                        publication.rek_description && publication.rek_description.length > 0 &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.ntroAbstract}
                            data={ReactHtmlParser(publication.rek_description)}
                        />
                    }
                    {/* ISMN */}
                    {
                        publication.fez_record_search_key_ismn && publication.fez_record_search_key_ismn.length > 0 &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.fez_record_search_key_ismn}
                            data={publication.fez_record_search_key_ismn.map((item, index) => {
                                return (
                                    <span key={index}>
                                        {item.rek_ismn}
                                        {publication.fez_record_search_key_ismn.length > 1 && index < publication.fez_record_search_key_ismn.length - 1 && <br/>}
                                    </span>
                                );
                            })
                            }
                        />
                    }
                    {/* ISRC */}
                    {
                        publication.fez_record_search_key_isrc && publication.fez_record_search_key_isrc.length > 0 &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.fez_record_search_key_isrc}
                            data={publication.fez_record_search_key_isrc.map((item, index) => {
                                return (
                                    <span key={index}>
                                        {item.rek_isrc}
                                        {publication.fez_record_search_key_isrc.length > 1 && index < publication.fez_record_search_key_isrc.length - 1 && <br/>}
                                    </span>
                                );
                            })
                            }
                        />
                    }
                    {/* Series */}
                    {
                        publication.fez_record_search_key_series && publication.fez_record_search_key_series.rek_series &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.rek_series}
                            data={publication.fez_record_search_key_series.rek_series}
                        />
                    }
                    {/* Volume number */}
                    {
                        publication.fez_record_search_key_volume_number && publication.fez_record_search_key_volume_number.rek_volume_number &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.rek_volume_number}
                            data={publication.fez_record_search_key_volume_number.rek_volume_number}
                        />
                    }
                    {/* Issue number */}
                    {
                        publication.fez_record_search_key_issue_number && publication.fez_record_search_key_issue_number.rek_issue_number &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.rek_issue_number}
                            data={publication.fez_record_search_key_issue_number.rek_issue_number}
                        />
                    }
                    {/* Start page */}
                    {
                        publication.fez_record_search_key_start_page && publication.fez_record_search_key_start_page.rek_start_page &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.rek_start_page}
                            data={publication.fez_record_search_key_start_page.rek_start_page}
                        />
                    }
                    {/* End page */}
                    {
                        publication.fez_record_search_key_end_page && publication.fez_record_search_key_end_page.rek_end_page &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.rek_end_page}
                            data={publication.fez_record_search_key_end_page.rek_end_page}
                        />
                    }
                    {/* Total pages */}
                    {
                        publication.fez_record_search_key_total_pages && publication.fez_record_search_key_total_pages.rek_total_pages &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.rek_total_pages}
                            data={publication.fez_record_search_key_total_pages.rek_total_pages}
                        />
                    }

                    {/* Language */}
                    {
                        publication.fez_record_search_key_language && publication.fez_record_search_key_language.length > 0 &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.rek_language}
                            data={publication.fez_record_search_key_language.map((item1, index) => {
                                return general.LANGUAGE.map((item2) => {
                                    return item1.rek_language === item2.value &&
                                        <span key={index}>
                                            {item2.text}
                                            {publication.fez_record_search_key_language.length > 1 && index < publication.fez_record_search_key_language.length - 1 && ', '}
                                        </span>;
                                });
                            })
                            }
                        />
                    }

                    {/* Original format */}
                    {
                        publication.fez_record_search_key_original_format && publication.fez_record_search_key_original_format.rek_original_format &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.rek_original_format}
                            data={publication.fez_record_search_key_original_format.rek_original_format}
                        />
                    }
                    {/* Audience size */}
                    {
                        publication.fez_record_search_key_audience_size && publication.fez_record_search_key_audience_size.rek_audience_size &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.rek_audience_size}
                            data={general.AUDIENCE_SIZE.map((item) => {
                                return item.value === publication.fez_record_search_key_audience_size.rek_audience_size && item.text;
                            })}
                        />
                    }
                    {/* Quality indicators */}
                    {
                        publication.fez_record_search_key_quality_indicator && publication.fez_record_search_key_quality_indicator.length > 0 &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.qualityIndicators}
                            data={publication.fez_record_search_key_quality_indicator.map((item1, index) => {
                                return general.QUALITY_INDICATORS.map((item2) => {
                                    return item1.rek_quality_indicator === item2.value &&
                                        <span key={index}>
                                            {item2.text}
                                            {publication.fez_record_search_key_quality_indicator.length > 1 && index < publication.fez_record_search_key_quality_indicator.length - 1 && ', '}
                                        </span>;
                                });
                            })
                            }
                        />
                    }
                </StandardCard>
            </Grid>
        );
    }
}

export default withStyles(styles)(NtroDetails);
