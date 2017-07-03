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

    getPublicationYear = (collectionYear) => {
        if (collectionYear) {
            return `(${new Date(collectionYear).getFullYear()}) `;
        }

        return '';
    };

    getPageNumbers = (startPage, endPage) => {
        if (startPage && endPage) {
            return ` ${startPage}-${endPage}`;
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

        console.log('ClaimPublicationRow', entry);
        const authorListSize = entry.authors.size;

        return (
            <div className="claimWrapper">
                <h3 className="claimTitle">{entry.rek_title}</h3>

                {entry.authors.size > 0 &&
                    <div className="claimAuthors">
                    <FontIcon className="material-icons claimAuthorsIcon" data-tip="Authors"
                    data-for="claimTooltips" data-place="left">people</FontIcon>
                    {authorListSize <= 10 && (
                        this.getAuthorsList(entry.authors, authorListSize)
                    )}

                    {authorListSize > 10 && (
                        this.getExtendedAuthorsList(entry.authors, authorListSize)
                    )}
                    </div>
                }

                <div className="claimJournal">
                    <FontIcon className="material-icons claimJournalIcon" data-tip="Published"
                              data-for="claimTooltips" data-place="left">library_books</FontIcon>
                    {this.getPublicationYear(entry.collectionYear)}
                    {entry.rek_journal_name}
                    {this.getPageNumbers(entry.startPage, entry.endPage)}
                </div>


                <div className="claimStats">
                    {entry.counts.thomson &&
                        <span>
                            <img src={thompsonIcon} alt="Thomson Routers"
                            data-tip="Thomson Routers Web of Science citation count"
                            data-for="claimTooltips"/> {entry.counts.thomson}
                        </span>
                    }
                    {entry.counts.scopus &&
                        <span>
                            <img src={scopusIcon} alt="Scopus" data-tip="Scopus citation count"
                            data-for="claimTooltips" style={{marginLeft: '10px'}}/> {entry.counts.scopus}
                        </span>
                    }
                    {entry.counts.google &&
                        <span>
                            <img src={googleScholarIcon} alt="Google Scholar"
                            data-tip="Google Scholar citation count" data-for="claimTooltips"
                            style={{marginLeft: '10px'}}/> {entry.counts.google}
                        </span>
                    }
                    {entry.counts.altmetric &&
                        <span>
                            <img src={altmetricIcon} alt="Altmetric" data-tip="Altmetric score"
                            data-for="claimTooltips" style={{marginLeft: '10px'}}/> {entry.counts.altmetric}
                        </span>
                    }
                    {entry.counts.downloads &&
                        <span>
                        <FontIcon className="material-icons claimStatsIcon" data-tip="Downloads"
                              data-for="claimTooltips" data-place="bottom"
                              style={{marginLeft: '10px'}}>file_download</FontIcon> {entry.counts.downloads}
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
