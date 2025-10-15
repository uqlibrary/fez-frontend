import React from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export const DigilibImageCitation = ({ publication, citationStyle }) => {
    const record = {
        id: publication.rek_pid,
        title: publication.rek_title,
        datePhotoTaken: publication.fez_record_search_key_date_photo_taken
            ? publication.fez_record_search_key_date_photo_taken.rek_date_photo_taken
            : null,
        doi: publication.fez_record_search_key_doi ? publication.fez_record_search_key_doi.rek_doi : null,
    };

    // eSpace citation view for Digilib Image
    // {Photographer}{Date photo taken| (|).}<i>{Title| |.}</i>

    return (
        <span id={`citation-content-${publication.rek_pid}`} className="citationContent citationDesign">
            {/* {Photographer} */}
            <Partials.AuthorsCitationView citationStyle={citationStyle} publication={publication} />

            {/* {Date photo taken| (|).} */}
            <Partials.DateCitationView date={record.datePhotoTaken} />

            {/* <i>{Title| |.}</i> */}
            <Partials.CitationTitleView className="citationTitle" value={record.title} />

            {/* {doi| doi:|}*/}
            <Partials.DoiCitationView doi={record.doi} />
        </span>
    );
};
DigilibImageCitation.propTypes = {
    publication: PropTypes.object.isRequired,
    citationStyle: PropTypes.string,
};
export default React.memo(DigilibImageCitation);
