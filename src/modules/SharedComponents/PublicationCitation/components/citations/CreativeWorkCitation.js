import React from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export const CreativeWorkCitation = ({ publication, citationStyle }) => {
    const record = {
        id: publication.rek_pid,
        title: publication.rek_title,
        placeOfPublication: publication.fez_record_search_key_place_of_publication
            ? publication.fez_record_search_key_place_of_publication.rek_place_of_publication
            : null,
        publisher: publication.fez_record_search_key_publisher
            ? publication.fez_record_search_key_publisher.rek_publisher
            : null,
        doi: publication.fez_record_search_key_doi ? publication.fez_record_search_key_doi.rek_doi : null,
    };

    // eSpace citation view for Creative Work
    // {Creator}{Publication Year| (|).}<i>{Title| |.}</i>{Place of Publication| |:}{Publisher| |.}
    return (
        <span id={`citation-content-${publication.rek_pid}`} className="citationContent citationCreativeWork">
            {/* {Creator} */}
            <Partials.AuthorsCitationView citationStyle={citationStyle} publication={publication} />

            {/* {Publication Year| (|).} */}
            <Partials.DateCitationView date={publication.rek_date} />

            {/* <i>{Title| |.}</i> */}
            <Partials.CitationTitleView className="citationTitle" value={record.title} />

            {/* {Place of Publication| |:} */}
            <Partials.CitationView
                className="citationPlaceOfPublication"
                value={record.placeOfPublication}
                suffix=":"
            />

            {/* {Publisher| |.} */}
            <Partials.CitationView className="citationPublisher" value={record.publisher} />

            {/* {doi| doi:|}*/}
            <Partials.DoiCitationView doi={record.doi} />
        </span>
    );
};
CreativeWorkCitation.propTypes = {
    publication: PropTypes.object.isRequired,
    citationStyle: PropTypes.string,
};
export default React.memo(CreativeWorkCitation);
