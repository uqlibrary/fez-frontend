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

    shouldComponentUpdate(nextProps) {
        return JSON.stringify(nextProps.publication) !== JSON.stringify(this.props.publication);
    }

    render() {
        const record = {
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
        // {Author}{Year| (|).}<i>{Title| |.}</i>{Journal name| |}{Volume number| |}{Issue number| (|)}{Start page|, |}{End page|-|}. {doi| doi:|}
        return (
            <div className="citationContent citationJournalArticle">
                <FontIcon className="material-icons citationIcon" data-place="left">
                    format_quote
                </FontIcon>

                {/* {Author}*/}
                <Partials.AuthorsCitationView publication={this.props.publication} />

                {/* {Year| (|).}*/}
                <Partials.DateCitationView date={this.props.publication.rek_date} />

                {/* {Title| |.} */}
                <Partials.CitationView className="citationTitle" value={record.title} />

                {/* {Journal name| |}*/}
                <Partials.CitationView className="citationJournalName" value={record.journalName} suffix=" " />

                {/* {Volume number| |}*/}
                <Partials.CitationView className="citationVolumeNumber" value={record.volumeNumber} suffix=" "/>

                {/* {Issue number| (|)}*/}
                <Partials.CitationView className="citationIssueNumber" value={record.issueNumber} prefix="(" suffix=") "/>

                {/* {Start page|, |}{End page|-|} */}
                <Partials.PageRangeCitationView publication={this.props.publication} suffix="" />
                <span>. </span>
                {/* {doi| doi:|}*/}
                <Partials.DoiCitationView doi={record.doi} />
            </div>
        );
    }
}
