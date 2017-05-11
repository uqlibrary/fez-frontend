import React, {Component} from 'react';
import PropTypes from 'prop-types';

import FlatButton from 'material-ui/FlatButton';
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
    }

    getPageNumbers = (entry) => {
        if (entry.get('fez_record_search_key_start_page') && entry.get('fez_record_search_key_end_page')) {
            return ` ${entry.get('fez_record_search_key_start_page').get('rek_start_page')}-${entry.get('fez_record_search_key_end_page').get('rek_end_page')}`;
        }

        return '';
    }

    render() {
        const {entry, hideClaimButton, claimRecordBtnLabel} = this.props;
        const counts = entry.get('counts');

        return (
            <div className="claimWrapper">
                <h3 className="claimTitle">{entry.get('rek_title')}</h3>

                {entry.get('authors') &&
                    <div className="claimAuthors">
                    <FontIcon className="material-icons claimAuthorsIcon" data-tip="Authors"
                    data-for="claimTooltips" data-place="left">people</FontIcon> Palomino,
                    Sheyla - Unger, Corinne - Edraki, Mansour
                    {entry.get('authors')}
                    </div>
                }

                <div className="claimJournal">
                    <FontIcon className="material-icons claimJournalIcon" data-tip="Published"
                              data-for="claimTooltips" data-place="left">library_books</FontIcon>
                    {this.getPublicationYear(entry)}
                    {entry.get('fez_record_search_key_journal_name').get('rek_journal_name')}
                    {this.getPageNumbers(entry)}
                </div>

                {counts &&
                    <div className="claimStats">
                        <img src={thompsonIcon} alt="Thomson Routers"
                             data-tip="Thomson Routers Web of Science citation count"
                             data-for="claimTooltips"/> {counts.thomson}
                        <img src={scopusIcon} alt="Scopus" data-tip="Scopus citation count"
                             data-for="claimTooltips" style={{marginLeft: '10px'}}/> {counts.scopus}
                        <img src={googleScholarIcon} alt="Google Scholar"
                             data-tip="Google Scholar citation count" data-for="claimTooltips"
                             style={{marginLeft: '10px'}}/> {counts.google}
                        <img src={altmetricIcon} alt="Altmetric" data-tip="Altmetric score"
                             data-for="claimTooltips" style={{marginLeft: '10px'}}/> {counts.altmetric}
                        <FontIcon className="material-icons claimStatsIcon" data-tip="Downloads"
                                  data-for="claimTooltips" data-place="bottom"
                                  style={{marginLeft: '10px'}}>file_download</FontIcon> {counts.downloads}
                    </div>
                }
                {!hideClaimButton &&
                    <div className="claimButtonWrapper">
                        <FlatButton label={claimRecordBtnLabel} secondary onTouchTap={() => this.claimThisPublication(entry.get('rek_pid'))} />
                    </div>
                }
                <div style={{clear: 'both'}} />
            </div>
        );
    }
}
