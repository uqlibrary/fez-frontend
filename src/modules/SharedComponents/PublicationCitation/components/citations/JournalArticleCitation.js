import React from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export const JournalArticleCitation = ({ publication, hideDoiLink, citationStyle }) => {
    const record = {
        id: publication.rek_pid,
        title: publication.rek_title,
        journalName: publication.fez_record_search_key_journal_name
            ? publication.fez_record_search_key_journal_name.rek_journal_name
            : null,
        volumeNumber: publication.fez_record_search_key_volume_number
            ? publication.fez_record_search_key_volume_number.rek_volume_number
            : null,
        issueNumber: publication.fez_record_search_key_issue_number
            ? publication.fez_record_search_key_issue_number.rek_issue_number
            : null,
        articleNumber: publication.fez_record_search_key_article_number
            ? publication.fez_record_search_key_article_number.rek_article_number
            : null,
        doi: publication.fez_record_search_key_doi ? publication.fez_record_search_key_doi.rek_doi : null,
    };

    // eSpace citation view for Journal Article
    return (
        <span id={`citation-content-${publication.rek_pid}`} className="citationContent citationJournalArticle">
            {/* {Author}*/}
            <Partials.AuthorsCitationView citationStyle={citationStyle} publication={publication} />

            {/* {Year| (|).}*/}
            <Partials.DateCitationView date={publication.rek_date} />

            {/* {Title| |.} */}
            <Partials.CitationTitleView className="citationTitle" value={record.title} />

            {/* {Journal name| |}*/}
            <Partials.CitationView className="citationJournalName" value={record.journalName} suffix=" " />

            {/* {Volume number| |}*/}
            <Partials.CitationView className="citationVolumeNumber" value={record.volumeNumber} suffix=" " />

            {/* {Issue number| (|)}*/}
            <Partials.CitationView className="citationIssueNumber" value={record.issueNumber} prefix="(" suffix=") " />

            {/* {Article number| |}*/}
            <Partials.CitationView className="citationArticleNumber" value={record.articleNumber} suffix=" " />

            {/* {Start page|, |}{End page|-|} */}
            <Partials.PageRangeCitationView publication={publication} suffix="" />
            <span>. </span>
            {/* {doi| doi:|}*/}
            <Partials.DoiCitationView doi={record.doi} hideDoiLink={hideDoiLink} />
        </span>
    );
};
JournalArticleCitation.propTypes = {
    publication: PropTypes.object.isRequired,
    hideDoiLink: PropTypes.bool,
    citationStyle: PropTypes.string,
};
export default React.memo(JournalArticleCitation);
