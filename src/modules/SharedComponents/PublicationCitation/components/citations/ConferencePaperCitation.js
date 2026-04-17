import React from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export const ConferencePaperCitation = ({ publication, hideDoiLink, citationStyle }) => {
    const record = {
        id: publication.rek_pid,
        title: publication.rek_title,
        name: publication.fez_record_search_key_conference_name
            ? publication.fez_record_search_key_conference_name.rek_conference_name
            : null,
        location: publication.fez_record_search_key_conference_location
            ? publication.fez_record_search_key_conference_location.rek_conference_location
            : null,
        dates: publication.fez_record_search_key_conference_dates
            ? publication.fez_record_search_key_conference_dates.rek_conference_dates
            : null,
        placeOfPublication: publication.fez_record_search_key_place_of_publication
            ? publication.fez_record_search_key_place_of_publication.rek_place_of_publication
            : null,
        publisher: publication.fez_record_search_key_publisher
            ? publication.fez_record_search_key_publisher.rek_publisher
            : null,
        doi: publication.fez_record_search_key_doi ? publication.fez_record_search_key_doi.rek_doi : null,
    };

    // eSpace citation view for conference paper
    return (
        <span id={`citation-content-${publication.rek_pid}`} className="citationContent citationConferencePaper">
            {/* {Author}*/}
            <Partials.AuthorsCitationView citationStyle={citationStyle} publication={publication} />

            {/* {Publication Year| (|).}*/}
            <Partials.DateCitationView date={publication.rek_date} />

            {/* <i>{Title| |.}</i>*/}
            <Partials.CitationTitleView className="citationTitle" value={record.title} />

            {/* {Conference Name| |,}*/}
            <Partials.CitationView className="citationConferenceName" value={record.name} suffix=", " />
            {/* {Conference Location| |,}*/}

            <Partials.CitationView className="citationConferenceLocation" value={record.location} suffix=", " />

            {/* {Conference Date| |.}*/}
            <Partials.CitationView className="citationConferenceDates" value={record.dates} />

            {/* {Place of Publication| |:} */}
            <Partials.CitationView
                className="citationPlaceOfPublication"
                value={record.placeOfPublication}
                suffix=":"
            />

            {/* {Publisher| |.} */}
            <Partials.CitationView className="citationPublisher" value={record.publisher} />

            {/* {doi| doi:|} */}
            <Partials.DoiCitationView doi={record.doi} hideDoiLink={hideDoiLink} />
        </span>
    );
};
ConferencePaperCitation.propTypes = {
    publication: PropTypes.object.isRequired,
    hideDoiLink: PropTypes.bool,
    citationStyle: PropTypes.string,
};
export default React.memo(ConferencePaperCitation);
