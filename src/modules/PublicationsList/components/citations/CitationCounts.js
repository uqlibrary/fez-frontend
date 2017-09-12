import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';

import {locale} from 'config';

const thompsonIcon = require('images/thomson_icon.svg');
const scopusIcon = require('images/scopus_icon.svg');
const googleScholarIcon = require('images/google_scholar_icon.svg');
const altmetricIcon = require('images/altmetric_icon.svg');
const openAccessIcon = require('images/oa_icon.svg');

export default class CitationCounts extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired
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
            <div className="citationCounts columns is-multiline is-gapless">
                {
                    !!counts.wos && counts.wos > 0 &&
                    <span className="citationCount">
                        <img
                            src={thompsonIcon}
                            alt={txt.wosCountLabel.replace('[count]', counts.wos)}
                            title={txt.wosCountLabel.replace('[count]', counts.wos)}
                            className="citationCountIcon"/>
                        <span className="citationCountNumber">{counts.wos}</span>
                    </span>
                }
                {
                    !!counts.scopus && counts.scopus > 0 &&
                    <span className="citationCount">
                        <img
                            src={scopusIcon}
                            alt={txt.scopusCountLabel.replace('[count]', counts.scopus)}
                            title={txt.scopusCountLabel.replace('[count]', counts.scopus)}
                            className="citationCountIcon"/>
                        <span className="citationCountNumber">{counts.scopus}</span>
                    </span>
                }
                {
                    !!counts.altmetric && counts.altmetric > 0 &&
                    <span className="citationCount">
                        <img
                            src={altmetricIcon}
                            alt={txt.altmetricCountLabel.replace('[count]', counts.altmetric)}
                            title={txt.altmetricCountLabel.replace('[count]', counts.altmetric)}
                            className="citationCountIcon"/>
                        <span className="citationCountNumber">{counts.altmetric}</span>
                    </span>
                }
                {
                    // TODO: get IDs/Lookups of open access to be displayed
                    !!this.props.publication.rek_pid && !!this.props.publication.fez_record_search_key_oa_status &&
                    // txt.openAccessValues.indexOf(this.props.publication.fez_record_search_key_oa_status.rek_oa_status) >= 0 &&
                    <span className="citationCount">
                        <img
                            src={openAccessIcon}
                            alt={txt.openAccessLabel}
                            title={txt.openAccessLabel}
                            className="citationCountIcon"/>
                    </span>
                }
                {
                    !!this.props.publication.rek_pid &&
                    <span className="citationCount">
                        <a className="citationCountLink" href={`https://scholar.google.com/scholar?q=intitle:"${encodeURI(this.props.publication.rek_title)}"`} target="_blank">
                            <img
                                src={googleScholarIcon}
                                alt={txt.googleCountLabel}
                                title={txt.googleCountLabel}
                                className="citationCountIcon"/>
                        </a>
                    </span>
                }
                {
                    !!this.props.publication.rek_pid && (counts.wos || counts.scopus) &&
                    <span className="citationCount column is-full-mobile">
                        <a className="citationCountLink" href={`https://app.library.uq.edu.au/#/authors/view/${this.props.publication.rek_pid}`} target="_blank">
                            <FontIcon className="citationCountIcon material-icons">open_in_new</FontIcon>
                            <span className="citationCountNumber">{txt.statsLabel}</span>
                        </a>
                    </span>
                }
            </div>
        );
    }
}
