import React, {Component} from 'react';
import PropTypes from 'prop-types';

import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

import './PublicationRow.scss';

const thompsonIcon = require('../../../../images/thomson_icon.svg');
const scopusIcon = require('../../../../images/scopus_icon.svg');
const googleScholarIcon = require('../../../../images/googlescholar_icon.svg');
const altmetricIcon = require('../../../../images/altmetric_icon.svg');

export default class PublicationRow extends Component {

    static propTypes = {
        entry: PropTypes.object.isRequired,
        claimRecordBtnLabel: PropTypes.string,
        showButtons: PropTypes.bool
    };

    static defaultProps = {
        claimRecordBtnLabel: 'Claim Record',
        showButtons: true
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {title, journalName, authors, counts, showButtons} = this.props.entry;
        return (
            <div className="claimWrapper">
                <h3 className="claimTitle">{title}</h3>

                {authors &&
                    <div className="claimAuthors">
                    <FontIcon className="material-icons claimAuthorsIcon" data-tip="Authors"
                    data-for="claimTooltips" data-place="left">people</FontIcon> Palomino,
                    Sheyla - Unger, Corinne - Edraki, Mansour
                    {{authors}}
                    </div>
                }

                <div className="claimJournal">
                    <FontIcon className="material-icons claimJournalIcon" data-tip="Published"
                              data-for="claimTooltips" data-place="left">library_books</FontIcon>
                    {journalName}
                </div>

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
                {showButtons &&
                    <div className="claimButtonWrapper">
                        <FlatButton label={this.props.claimRecordBtnLabel} secondary/>
                    </div>
                }
                <div style={{clear: 'both'}} />
            </div>
        );
    }
}
