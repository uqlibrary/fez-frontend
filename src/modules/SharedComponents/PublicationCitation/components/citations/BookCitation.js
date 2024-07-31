import React from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export const BookCitation = ({ publication, hideDoiLink, citationStyle }) => {
    const record = {
        id: publication.rek_pid,
        isEditedBook: publication.rek_subtype && publication.rek_subtype.toLowerCase() === 'edited book',
        title: publication.rek_title,
        edition: publication.fez_record_search_key_edition
            ? publication.fez_record_search_key_edition.rek_edition
            : null,
        series: publication.fez_record_search_key_series ? publication.fez_record_search_key_series.rek_series : null,
        placeOfPublication: publication.fez_record_search_key_place_of_publication
            ? publication.fez_record_search_key_place_of_publication.rek_place_of_publication
            : null,
        publisher: publication.fez_record_search_key_publisher
            ? publication.fez_record_search_key_publisher.rek_publisher
            : null,
        doi: publication.fez_record_search_key_doi ? publication.fez_record_search_key_doi.rek_doi : null,
    };

    // eSpace citation view for Book
    // {Author}{Publication Year| (|).}<i>{Title| |.}</i>{Edition| | ed.}
    // {Place of Publication| |:} {Publisher| |.} {doi| doi:|}
    // Edited Book (subtype: Edited Book)
    // {Editor|| ed.}{Publication Year| (|).}<i>{Title| |.}</i>{Edition| | ed.}
    // {Series Title| |,}{Place of Publication| |:}{Publisher| |.}
    // {doi| doi:|}

    return (
        <div className="citationContent citationBook">
            {/* {Author} */}
            {!record.isEditedBook && (
                <Partials.AuthorsCitationView citationStyle={citationStyle} publication={publication} />
            )}

            {/* {Editor|| ed.} */}
            {record.isEditedBook && (
                <Partials.EditorsCitationView
                    citationStyle={citationStyle}
                    prefix=""
                    publication={publication}
                    suffix=" ed."
                />
            )}

            {/* {Publication Year| (|).} */}
            <Partials.DateCitationView date={publication.rek_date} />

            {/* <i>{Title| |.}</i> */}
            <Partials.CitationTitleView className="citationTitle" value={record.title} />

            {/* {Edition| | ed.} */}
            <Partials.CitationView className="citationEdition" value={record.edition} suffix=" ed." />

            {/* {Series Title| |,} */}
            {record.isEditedBook && (
                <Partials.CitationView className="citationSeries" value={record.series} suffix="," />
            )}

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
        </div>
    );
};
BookCitation.propTypes = {
    publication: PropTypes.object.isRequired,
    hideDoiLink: PropTypes.bool,
    citationStyle: PropTypes.string,
};
export default React.memo(BookCitation);
