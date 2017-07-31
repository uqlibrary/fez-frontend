import React, {Component} from 'react';
import PropTypes from 'prop-types';

import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

const thompsonIcon = require('images/thomson_icon.svg');
const scopusIcon = require('images/scopus_icon.svg');
const googleScholarIcon = require('images/google_scholar_icon.svg');
const altmetricIcon = require('images/altmetric_icon.svg');

import {locale} from 'config';

export default class SearchResultsRow extends Component {

    static propTypes = {
        entry: PropTypes.object.isRequired,
        history: PropTypes.object,
        hideClaimButton: PropTypes.bool,
        claimRecordBtnLabel: PropTypes.string
    };

    static defaultProps = {
        claimRecordBtnLabel: 'Claim Record'
    };

    constructor(props) {
        super(props);
    }

    claimThisPublication = (id) => {
        this.props.history.push(`${locale.pages.claimPublications.claimUrl}${id}`);
    };

    render() {
        const {title, journalName, authors, counts, publisher, volumeNumber, issueNumber, startPage, endPage, doi, index} = this.props.entry;
        return (
            <div className="claimWrapper">
                <h3 className="title is-5" style={{marginBottom: 0}}>
                    {title}
                    {/* <a href="#" target="_blank"><FontIcon className="material-icons claimTitleIcon">open_in_new</FontIcon></a> */}
                </h3>

                <div className="claimCitation">
                    <FontIcon className="material-icons claimAuthorsIcon"
                              title="Full citation"
                              data-tip="Full citation"
                              data-for="claimTooltips"
                              data-place="left">
                        format_quote
                    </FontIcon>

                    <span className="claimAuthors">
                        <span className="allAuthors">{authors && authors.size > 0 && authors.map((author, index) => (
                            <span key={index}>{author.get('rek_author')} </span>))}</span>
                    </span>
                    {publisher} {title}.
                    {journalName && <i><span className="citation_journal_name"> {journalName}, </span></i>}
                    {volumeNumber && <i><span className="citation_volume_number"> {volumeNumber}:</span></i>}
                    {issueNumber && <span className="citation_issue_number">{issueNumber}:</span>}
                    {startPage && <span className="citation_start_page">{startPage}-</span>}
                    {endPage && <span className="citation_end_page">{endPage}.</span>}
                    {doi && <span className="citation_doi">doi: {doi}</span>}
                </div>

                <div className="claimStats">
                    {!!counts.thomson && counts.thomson > 0 &&
                    (<span>
                        <img src={thompsonIcon} alt="Thomson Routers"
                             data-tip="Thomson Routers Web of Science citation count"
                             title="Thomson Routers Web of Science citation count"
                             data-place="bottom"
                             data-for="claimTooltips"/> {counts.thomson}
                    </span>)
                    }
                    {!!counts.scopus && counts.scopus > 0 &&
                    (<span>
                        <img src={scopusIcon} alt="Scopus"
                             data-tip="Scopus citation count"
                             title="Scopus citation count"
                             data-for="claimTooltips" style={{marginLeft: '10px'}}/> {counts.scopus}
                    </span>)
                    }
                    {!!counts.google && counts.google > 0 &&
                    (<span>
                        <img src={googleScholarIcon} alt="Google Scholar"
                             data-tip="Google Scholar citation count" title="Google Scholar citation count"
                             data-for="claimTooltips"
                             style={{marginLeft: '10px'}}/> {counts.google}
                    </span>)
                    }
                    {!!counts.altmetric && counts.altmetric > 0 &&
                    (<span>
                        <img src={altmetricIcon} alt="Altmetric" data-tip="Altmetric score" title="Altmetric score"
                             data-for="claimTooltips" style={{marginLeft: '10px'}}/> {counts.altmetric}
                    </span>)
                    }
                    {!!counts.downloads && counts.downloads > 0 &&
                    (<span>
                        <FontIcon className="material-icons claimStatsIcon" data-tip="Downloads" title="Downloads"
                              data-for="claimTooltips" data-place="bottom"
                              style={{marginLeft: '10px'}}>file_download</FontIcon> {counts.downloads}
                    </span>)
                    }

                    {!this.props.hideClaimButton &&
                    <div className="claimButtonWrapper">
                        <FlatButton
                            label={this.props.claimRecordBtnLabel}
                            autoFocus={index === 0}
                            keyboardFocused={index === 0}
                            onTouchTap={() => this.claimThisPublication(index)}
                            secondary/>
                    </div>
                    }
                </div>
            </div>
        );
    }
}
