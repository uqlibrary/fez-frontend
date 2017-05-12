import React, {Component} from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

import './ClaimPublicationRow.scss';

const thompsonIcon = require('../../../../images/thomson_icon.svg');
const scopusIcon = require('../../../../images/scopus_icon.svg');
const googleScholarIcon = require('../../../../images/googlescholar_icon.svg');
const altmetricIcon = require('../../../../images/altmetric_icon.svg');

export default class ClaimPublicationRow extends Component {

    static propTypes = {
        history: PropTypes.object,
        entry: PropTypes.object.isRequired,
        claimRecordBtnLabel: PropTypes.string,
        hideClaimButton: PropTypes.bool,
        clearSelectedPublication: PropTypes.func,
        loadSelectedPublication: PropTypes.func
    };

    static defaultProps = {
        claimRecordBtnLabel: 'Claim Record'
    };

    constructor(props) {
        super(props);

        this.state = {
            authorListVisible: false
        };
    }

    claimThisPublication = (id) => {
        this.props.clearSelectedPublication();
        this.props.loadSelectedPublication(id);
        this.props.history.push(`/claim-publications/${id}`);
    };

    getPublicationYear = (entry) => {
        if (entry.get('fez_record_search_key_collection_year')) {
            return `(${new Date(entry.get('fez_record_search_key_collection_year').get('rek_collection_year')).getFullYear()}) `;
        }

        return '';
    };

    getPageNumbers = (entry) => {
        if (entry.get('fez_record_search_key_start_page') && entry.get('fez_record_search_key_end_page')) {
            return ` ${entry.get('fez_record_search_key_start_page').get('rek_start_page')}-${entry.get('fez_record_search_key_end_page').get('rek_end_page')}`;
        }

        return '';
    };

    getAuthorsList = (authors, size) => {
        const names = [];

        authors.map((author, index) => {
            const suffix = index < (size - 2) ? ', ' : '';
            const prefix = index === (size - 1) ? ' and ' : '';
            names.push(`${prefix}${author.get('name')}${suffix}`);
        });

        return names.join('');
    };

    updateAuthorListState = () => {
        this.setState({authorListVisible: !this.state.authorListVisible});
    }

    getExtendedAuthorsList = (authors, size) => {
        const names = [];
        const namesExtendedList = [];
        const maxDisplayLimit = 10;
        const showAuthorsBtnLabel = 'Show more authors';
        const hideAuthorsBtnLabel = 'Hide Authors';

        authors.map((author, index) => {
            const suffix = index < (size - 2) ? ', ' : '';
            const prefix = index === (size - 1) ? ' and ' : '';
            if (index >= maxDisplayLimit) {
                namesExtendedList.push(`${prefix}${author.get('name')}${suffix}`);
            } else {
                names.push(`${prefix}${author.get('name')}${suffix}`);
            }
        });

        return names.concat([
            <span key="extendedAuthorsList">
                <span className={this.state.authorListVisible ? '' : 'extendedAuthorsList'}>{namesExtendedList}</span>
                {this.state.authorListVisible ? ' ' : '..... '}
                <a href="void:;" onTouchTap={() => this.updateAuthorListState()}>{this.state.authorListVisible ? hideAuthorsBtnLabel : showAuthorsBtnLabel}</a>
            </span>]);
    };

    render() {
        const {entry, hideClaimButton, claimRecordBtnLabel} = this.props;
        const authorListSize = entry.get('rek_authors') ? entry.get('fez_record_search_key_author_count').get('rek_author_count') : 0;

        return (
            <div className="claimWrapper">
                <h3 className="claimTitle">{entry.get('rek_title')}</h3>

                {entry.get('rek_authors') &&
                    <div className="claimAuthors">
                    <FontIcon className="material-icons claimAuthorsIcon" data-tip="Authors"
                    data-for="claimTooltips" data-place="left">people</FontIcon>
                    {authorListSize <= 10 && (
                        this.getAuthorsList(entry.get('rek_authors'), authorListSize)
                    )}

                    {authorListSize > 10 && (
                        this.getExtendedAuthorsList(entry.get('rek_authors'), authorListSize)
                    )}
                    </div>
                }

                <div className="claimJournal">
                    <FontIcon className="material-icons claimJournalIcon" data-tip="Published"
                              data-for="claimTooltips" data-place="left">library_books</FontIcon>
                    {this.getPublicationYear(entry)}
                    {entry.get('fez_record_search_key_journal_name').get('rek_journal_name')}
                    {this.getPageNumbers(entry)}
                </div>


                <div className="claimStats">
                    {entry.get('rek_thomson_citation_count') &&
                        <span>
                            <img src={thompsonIcon} alt="Thomson Routers"
                            data-tip="Thomson Routers Web of Science citation count"
                            data-for="claimTooltips"/> {entry.get('rek_thomson_citation_count')}
                        </span>
                    }
                    {entry.get('rek_scopus_citation_count') &&
                        <span>
                            <img src={scopusIcon} alt="Scopus" data-tip="Scopus citation count"
                            data-for="claimTooltips" style={{marginLeft: '10px'}}/> {entry.get('rek_scopus_citation_count')}
                        </span>
                    }
                    {entry.get('rek_gs_citation_count') &&
                        <span>
                            <img src={googleScholarIcon} alt="Google Scholar"
                            data-tip="Google Scholar citation count" data-for="claimTooltips"
                            style={{marginLeft: '10px'}}/> {entry.get('rek_gs_citation_count')}
                        </span>
                    }
                    {entry.get('rek_altmetric_score') &&
                        <span>
                            <img src={altmetricIcon} alt="Altmetric" data-tip="Altmetric score"
                            data-for="claimTooltips" style={{marginLeft: '10px'}}/> {entry.get('rek_altmetric_score')}
                        </span>
                    }
                    {entry.get('rek_file_downloads') &&
                        <span>
                        <FontIcon className="material-icons claimStatsIcon" data-tip="Downloads"
                              data-for="claimTooltips" data-place="bottom"
                              style={{marginLeft: '10px'}}>file_download</FontIcon> {entry.get('rek_file_downloads')}
                        </span>
                    }
                </div>

                {!hideClaimButton &&
                    <div className="claimButtonWrapper">
                        <RaisedButton label={claimRecordBtnLabel} secondary onTouchTap={() => this.claimThisPublication(entry.get('rek_pid'))} />
                    </div>
                }
                <div style={{clear: 'both'}} />
            </div>
        );
    }
}
