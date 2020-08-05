import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export default class JournalArticleCitation extends PureComponent {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        hideDoiLink: PropTypes.bool,
        citationStyle: PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const record = {
            id: this.props.publication.rek_pid,
            title: this.props.publication.rek_title,
            journalName: this.props.publication.fez_record_search_key_journal_name
                ? this.props.publication.fez_record_search_key_journal_name.rek_journal_name
                : null,
            volumeNumber: this.props.publication.fez_record_search_key_volume_number
                ? this.props.publication.fez_record_search_key_volume_number.rek_volume_number
                : null,
            issueNumber: this.props.publication.fez_record_search_key_issue_number
                ? this.props.publication.fez_record_search_key_issue_number.rek_issue_number
                : null,
            articleNumber: this.props.publication.fez_record_search_key_article_number
                ? this.props.publication.fez_record_search_key_article_number.rek_article_number
                : null,
            doi: this.props.publication.fez_record_search_key_doi
                ? this.props.publication.fez_record_search_key_doi.rek_doi
                : null,
        };

        // eSpace citation view for Journal Article
        return (
            <div className="citationContent citationJournalArticle">
                {/* {Author}*/}
                <Partials.AuthorsCitationView
                    citationStyle={this.props.citationStyle}
                    publication={this.props.publication}
                />

                {/* {Year| (|).}*/}
                <Partials.DateCitationView date={this.props.publication.rek_date} />

                {/* {Title| |.} */}
                <Partials.CitationTitleView className="citationTitle" value={record.title} />

                {/* {Journal name| |}*/}
                <Partials.CitationView className="citationJournalName" value={record.journalName} suffix=" " />

                {/* {Volume number| |}*/}
                <Partials.CitationView className="citationVolumeNumber" value={record.volumeNumber} suffix=" " />

                {/* {Issue number| (|)}*/}
                <Partials.CitationView
                    className="citationIssueNumber"
                    value={record.issueNumber}
                    prefix="("
                    suffix=") "
                />

                {/* {Article number| |}*/}
                <Partials.CitationView className="citationArticleNumber" value={record.articleNumber} suffix=" " />

                {/* {Start page|, |}{End page|-|} */}
                <Partials.PageRangeCitationView publication={this.props.publication} suffix="" />
                <span>. </span>
                {/* {doi| doi:|}*/}
                <Partials.DoiCitationView doi={record.doi} hideDoiLink={this.props.hideDoiLink} />
            </div>
        );
    }
}
