import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import * as Partials from './partials';

export default class JournalArticleCitation extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        const journalArticle = {
            id: this.props.publication.rek_pid,
            title: this.props.publication.rek_title,
            journalName: this.props.publication.fez_record_search_key_journal_name ?
                this.props.publication.fez_record_search_key_journal_name.rek_journal_name : null,
            volumeNumber: this.props.publication.fez_record_search_key_volume_number ?
                this.props.publication.fez_record_search_key_volume_number.rek_volume_number : null,
            issueNumber: this.props.publication.fez_record_search_key_issue_number ?
                this.props.publication.fez_record_search_key_issue_number.rek_issue_number : null,
            doi: this.props.publication.fez_record_search_key_doi ?
                this.props.publication.fez_record_search_key_doi.rek_doi : null
        };

        // eSpace citation view for Journal Article
        // {6351} ({6386}) {10588}. <i>{11071}</i>, <i>{6379}</i> {6377||:} {6383}{6384|-}.{16514| doi:|}
        // authors (year) title. <i>journal name</i>, <i>volume</i> {issue:} start page-end page. doi: DOI
        return (
            <div className="citationContent citationJournalArticle">
                <FontIcon className="material-icons citationIcon" data-place="left">
                    format_quote
                </FontIcon>

                <Partials.AuthorsCitationView publication={this.props.publication} />

                <Partials.YearCitationView publication={this.props.publication} />

                <span className="citationTitle"> {journalArticle.title}.</span>
                {
                    journalArticle.journalName &&
                    <span className="citationJournalName"> {journalArticle.journalName},</span>
                }
                {
                    journalArticle.volumeNumber &&
                    <span className="citationVolumeNumber"> {journalArticle.volumeNumber}</span>
                }
                {
                    journalArticle.issueNumber &&
                    <span className="citationIssueNumber"> {journalArticle.issueNumber}</span>
                }
                <Partials.PageRangeCitationView publication={this.props.publication} prefix=": " suffix="" />
                .
                {
                    journalArticle.doi &&
                    <span className="citationDOI">
                        <span className="citationLabel"> doi: </span>
                        <span className="citationValue"> {journalArticle.doi} </span>
                    </span>
                }
            </div>
        );
    }
}
