import React, {Component} from 'react';
import PropTypes from 'prop-types';

import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

const thompsonIcon = require('images/thomson_icon.svg');
const scopusIcon = require('images/scopus_icon.svg');
const googleScholarIcon = require('images/googlescholar_icon.svg');
const altmetricIcon = require('images/altmetric_icon.svg');

export default class SearchResultsRow extends Component {

    static propTypes = {
        entry: PropTypes.object.isRequired,
        claimRecordBtnLabel: PropTypes.string
    };

    static defaultProps = {
        claimRecordBtnLabel: 'Claim Record'
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {title, journalName, authors, counts} = this.props.entry;
        return (
            <div className="claimWrapper">
                <a href="#claimTitle">
                    <h3 className="claimTitle">{title}
                        <FontIcon className="material-icons claimTitleIcon">open_in_new</FontIcon>
                    </h3>
                </a>

                {authors &&
                    <div className="claimAuthors">
                    <FontIcon className="material-icons claimAuthorsIcon" data-tip="Authors"
                    data-for="claimTooltips" data-place="left">people</FontIcon>
                    {authors.map((author) => (
                        <span>{author.get('rek_author')}, </span>
                    ))}
                    </div>
                }

                <div className="claimJournal">
                    <FontIcon className="material-icons claimJournalIcon" data-tip="Published"
                              data-for="claimTooltips" data-place="left">library_books</FontIcon>
                    {journalName}
                </div>

                <div className="claimStats">
                    {counts.thomson > 0 &&
                    <span>
                        <img src={thompsonIcon} alt="Thomson Routers"
                             data-tip="Thomson Routers Web of Science citation count"
                             data-for="claimTooltips"/> {counts.thomson}
                    </span>
                    }
                    {counts.scopus > 0 &&
                    <span>
                        <img src={scopusIcon} alt="Scopus"
                             data-tip="Scopus citation count"
                             data-for="claimTooltips" style={{marginLeft: '10px'}}/> {counts.scopus}
                    </span>
                    }
                    {counts.google > 0 &&
                    <span>
                    <img src={googleScholarIcon} alt="Google Scholar"
                         data-tip="Google Scholar citation count" data-for="claimTooltips"
                         style={{marginLeft: '10px'}}/> {counts.google}
                    </span>
                    }
                    {counts.altmetric > 0 &&
                    <span>
                    <img src={altmetricIcon} alt="Altmetric" data-tip="Altmetric score"
                         data-for="claimTooltips" style={{marginLeft: '10px'}}/> {counts.altmetric}
                    </span>
                    }
                    {counts.downloads > 1 && (
                    <span>
                    <FontIcon className="material-icons claimStatsIcon" data-tip="Downloads"
                              data-for="claimTooltips" data-place="bottom"
                              style={{marginLeft: '10px'}}>file_download</FontIcon> {counts.downloads}
                    </span>
                    )
                    }
                </div>

                <div className="claimButtonWrapper">
                    <FlatButton label={this.props.claimRecordBtnLabel} secondary />
                </div><div style={{clear: 'both'}} />
            </div>
        );
    }
}
