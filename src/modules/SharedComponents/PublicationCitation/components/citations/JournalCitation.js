import React from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export const JournalCitation = ({ publication, hideDoiLink }) => {
    const record = {
        id: publication.rek_pid,
        title: publication.rek_title,
        volumeNumber: publication.fez_record_search_key_volume_number
            ? publication.fez_record_search_key_volume_number.rek_volume_number
            : null,
        issueNumber: publication.fez_record_search_key_issue_number
            ? publication.fez_record_search_key_issue_number.rek_issue_number
            : null,
        doi: publication.fez_record_search_key_doi ? publication.fez_record_search_key_doi.rek_doi : null,
    };

    // eSpace citation view for Journal
    return (
        <span id={`citation-content-${publication.rek_pid}`} className="citationContent citationJournal">
            {/* {Title of journal} */}
            <Partials.CitationTitleView className="citationJournalName" value={record.title} prefix="" suffix=" " />

            {/* {Publication Year| (|).}*/}
            <Partials.DateCitationView date={publication.rek_date} />

            {/* {Volume number| |}*/}
            <Partials.CitationView className="citationVolumeNumber" value={record.volumeNumber} suffix=" " />

            {/* {Issue number| (|)}*/}
            <Partials.CitationView className="citationIssueNumber" value={record.issueNumber} prefix="(" suffix=")." />

            {/* {doi| doi:|}*/}
            <Partials.DoiCitationView doi={record.doi} hideDoiLink={hideDoiLink} />
        </span>
    );
};
JournalCitation.propTypes = {
    publication: PropTypes.object.isRequired,
    hideDoiLink: PropTypes.bool,
};
export default React.memo(JournalCitation);
