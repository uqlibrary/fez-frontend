import React from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export const BookChapterCitation = ({ publication, hideDoiLink, citationStyle }) => {
    const record = {
        id: publication.rek_pid,
        title: publication.rek_title,
        bookTitle: publication.fez_record_search_key_book_title
            ? publication.fez_record_search_key_book_title.rek_book_title
            : null,
        placeOfPublication: publication.fez_record_search_key_place_of_publication
            ? publication.fez_record_search_key_place_of_publication.rek_place_of_publication
            : null,
        publisher: publication.fez_record_search_key_publisher
            ? publication.fez_record_search_key_publisher.rek_publisher
            : null,
        doi: publication.fez_record_search_key_doi ? publication.fez_record_search_key_doi.rek_doi : null,
    };

    // eSpace citation view for Book Chapter
    return (
        <div className="citationContent citationBookChapter">
            {/* {Author} */}
            <Partials.AuthorsCitationView citationStyle={citationStyle} publication={publication} />

            {/* {Publication Year| (|).} */}
            <Partials.DateCitationView date={publication.rek_date} />

            {/* {Title| |.} */}
            <Partials.CitationTitleView className="citationTitle" value={record.title} />

            {/* Book Title| |. */}
            <Partials.CitationView className="citationBookTitle" value={record.bookTitle} />

            {/* {Editor| edited by |.}*/}
            <Partials.EditorsCitationView citationStyle={citationStyle} publication={publication} />

            {/* {Place of Publication| |:} */}
            <Partials.CitationView
                className="citationPlaceOfPublication"
                value={record.placeOfPublication}
                suffix=":"
            />

            {/* {Publisher| |.} */}
            <Partials.CitationView className="citationPublisher" value={record.publisher} />

            {/* {Start page| |}{End page|-|.} */}
            <Partials.PageRangeCitationView publication={publication} />

            {/* {doi| doi:|} */}
            <Partials.DoiCitationView doi={record.doi} hideDoiLink={hideDoiLink} />
        </div>
    );
};

BookChapterCitation.propTypes = {
    publication: PropTypes.object.isRequired,
    hideDoiLink: PropTypes.bool,
    citationStyle: PropTypes.string,
};

export default React.memo(BookChapterCitation);
