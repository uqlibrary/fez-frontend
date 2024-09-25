import React from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export const ConferenceProceedingsCitation = ({ citationStyle, hideDoiLink, publication }) => {
    const record = {
        id: publication.rek_pid,
        title: publication.rek_title,
        conferenceName: publication.fez_record_search_key_conference_name
            ? publication.fez_record_search_key_conference_name.rek_conference_name
            : null,
        conferenceLocation: publication.fez_record_search_key_conference_location
            ? publication.fez_record_search_key_conference_location.rek_conference_location
            : null,
        conferenceDate: publication.fez_record_search_key_conference_dates
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

    // eSpace citation view for Conference Proceedings
    // {Editor/s || ed.}{Publication Year| (|).}<i>{Title of proceedings| |.}</i>{Conference Name| |,}{Conference Location| |,}{Conference Date| |.}{Place of Publication| |:}{Publisher| |.} {doi| https://doi.org/||}

    return (
        <div className="citationContent citationDesign">
            {/* {Editor/s || ed.} */}
            <Partials.EditorsCitationView
                citationStyle={citationStyle}
                prefix=""
                publication={publication}
                suffix=" ed. "
            />

            {/* {Publication Year| (|).} */}
            <Partials.DateCitationView date={publication.rek_date} />

            {/* <i>{Title of proceedings| |.}</i> */}
            <Partials.CitationTitleView className="citationTitle" value={record.title} />

            {/* {Conference Name| |,} */}
            <Partials.CitationView className="citationConferenceName" value={record.conferenceName} suffix=", " />

            {/* {Conference Location| |,} */}
            <Partials.CitationView
                className="citationConferenceLocation"
                value={record.conferenceLocation}
                suffix=", "
            />

            {/* {Conference Date| |.} */}
            <Partials.CitationView className="citationConferenceDate" value={record.conferenceDate} />

            {/* {Place of Publication| |:} */}
            <Partials.CitationView
                className="citationPlaceOfPublication"
                value={record.placeOfPublication}
                suffix=": "
            />

            {/* {Publisher| |.} */}
            <Partials.CitationView className="citationPublisher" value={record.publisher} />

            {/* {doi| https://doi.org/||} */}
            <Partials.DoiCitationView doi={record.doi} hideDoiLink={hideDoiLink} />
        </div>
    );
};
ConferenceProceedingsCitation.propTypes = {
    citationStyle: PropTypes.string,
    hideDoiLink: PropTypes.bool,
    publication: PropTypes.object.isRequired,
};
export default React.memo(ConferenceProceedingsCitation);
