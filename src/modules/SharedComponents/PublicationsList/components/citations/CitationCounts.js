import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ActionOpenInNew from 'material-ui/svg-icons/action/open-in-new';

import {locale} from 'config';
import {openAccessIdLookup} from 'config/general';

const thompsonIcon = require('images/thomson_icon.svg');
const scopusIcon = require('images/scopus_icon.svg');
const googleScholarIcon = require('images/google_scholar_icon.svg');
const altmetricIcon = require('images/altmetric_icon.svg');
const openAccessIcon = require('images/oa_icon.svg');

export default class CitationCounts extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const txt = locale.components.publicationCitation.citationCounts;

        const counts = {
            wos: this.props.publication.rek_thomson_citation_count ? this.props.publication.rek_thomson_citation_count : null,
            scopus: this.props.publication.rek_scopus_citation_count ? this.props.publication.rek_scopus_citation_count : null,
            google: this.props.publication.rek_gs_citation_count ? this.props.publication.rek_gs_citation_count : null,
            altmetric: this.props.publication.rek_altmetric_score ? this.props.publication.rek_altmetric_score : null
        };
        return (
            <div className="citationCounts columns is-multiline is-gapless is-marginless">
                {
                    !!counts.wos && counts.wos > 0 &&
                    <span className="citationCount">
                        <a href={locale.global.sources.wos.externalUrl.replace('[id]', this.props.publication.fez_record_search_key_isi_loc.rek_isi_loc)}
                            rel="noopener noreferrer"
                            target="_blank"
                            aria-label={locale.global.linkWillOpenInNewWindow.replace('[destination]', this.props.publication.rek_title + ' (' + locale.global.sources.wos.title + ')')}
                        >
                            <img
                                src={thompsonIcon}
                                alt={txt.wosCountLabel.replace('[count]', counts.wos)}
                                title={txt.wosCountLabel.replace('[count]', counts.wos)}
                                className="citationCountIcon"/>
                            <span className="citationCountNumber">{counts.wos}</span>
                        </a>
                    </span>
                }
                {
                    !!counts.scopus && counts.scopus > 0 &&
                    <span className="citationCount">
                        <a href={locale.global.sources.scopus.externalUrl.replace('[id]', this.props.publication.fez_record_search_key_scopus_id.rek_scopus_id)}
                            rel="noopener noreferrer"
                            target="_blank"
                            aria-label={locale.global.linkWillOpenInNewWindow.replace('[destination]', this.props.publication.rek_title + ' (' + locale.global.sources.scopus.title + ')')}
                        >
                            <img
                                src={scopusIcon}
                                alt={txt.scopusCountLabel.replace('[count]', counts.scopus)}
                                title={txt.scopusCountLabel.replace('[count]', counts.scopus)}
                                className="citationCountIcon"/>
                            <span className="citationCountNumber">{counts.scopus}</span>
                        </a>
                    </span>
                }
                {
                    !!counts.altmetric && counts.altmetric > 0 &&
                    <span className="citationCount">
                        <a href={txt.altmetric.externalUrl.replace('[id]', this.props.publication.rek_altmetric_id)}
                            rel="noopener noreferrer"
                            target="_blank"
                            aria-label={locale.global.linkWillOpenInNewWindow.replace('[destination]', this.props.publication.rek_title + ' (' + txt.altmetric.title + ')')}
                        >
                            <img
                                src={altmetricIcon}
                                alt={txt.altmetricCountLabel.replace('[count]', counts.altmetric)}
                                title={txt.altmetricCountLabel.replace('[count]', counts.altmetric)}
                                className="citationCountIcon"/>
                            <span className="citationCountNumber">{counts.altmetric}</span>
                        </a>
                    </span>
                }
                {
                    !!this.props.publication.rek_pid &&
                    <span className="citationCount">
                        <a className="citationCountLink"
                            href={txt.google.externalUrl + encodeURI(this.props.publication.rek_title)}
                            target="_blank"
                            aria-label={locale.global.linkWillOpenInNewWindow.replace('[destination]', this.props.publication.rek_title + ' (' + txt.google.title + ')')}
                        >
                            <img
                                src={googleScholarIcon}
                                alt={txt.googleCountLabel}
                                title={txt.googleCountLabel}
                                className="citationCountIcon"/>{counts.google}
                        </a>
                    </span>
                }
                {
                    !!this.props.publication.rek_pid && !!this.props.publication.fez_record_search_key_oa_status &&
                    !!openAccessIdLookup[this.props.publication.fez_record_search_key_oa_status.rek_oa_status] &&
                    <span className="citationCount">
                        <img
                            src={openAccessIcon}
                            alt={txt.openAccessLabel.replace('[oa_status]', openAccessIdLookup[this.props.publication.fez_record_search_key_oa_status.rek_oa_status])}
                            title={txt.openAccessLabel.replace('[oa_status]', openAccessIdLookup[this.props.publication.fez_record_search_key_oa_status.rek_oa_status])}
                            className="citationCountIcon"/>
                    </span>
                }
                {
                    !!this.props.publication.rek_pid && (counts.wos || counts.scopus) &&
                    <div className="citationCount column">
                        <a className="citationCountLink" href={`https://app.library.uq.edu.au/#/authors/view/${this.props.publication.rek_pid}`} target="_blank">
                            <div className="columns is-mobile is-gapless">
                                <div className="column is-narrow citationCountNumber">
                                    {txt.statsLabel}
                                    <ActionOpenInNew className="citationOpenUrlIcon" />
                                </div>
                            </div>
                        </a>
                    </div>
                }
            </div>
        );
    }
}
