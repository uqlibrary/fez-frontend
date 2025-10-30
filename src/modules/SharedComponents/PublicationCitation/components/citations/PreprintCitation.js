import React from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export const PreprintCitation = ({ publication, citationStyle }) => {
    const record = {
        id: publication.rek_pid,
        title: publication.rek_title,
        doi: publication.fez_record_search_key_doi ? publication.fez_record_search_key_doi.rek_doi : null,
    };

    // eSpace citation view for Preprint
    // {Author}{Year| (|).}<i>{Title| |.}</i>
    return (
        <span id={`citation-content-${publication.rek_pid}`} className="citationContent citationPreprint">
            {/* {Author}*/}
            <Partials.AuthorsCitationView citationStyle={citationStyle} publication={publication} />

            {/* {Year| (|).}*/}
            <Partials.DateCitationView date={publication.rek_date} />

            {/* <i>{Title| |.}</i> */}
            <Partials.CitationTitleView className="citationTitle" value={record.title} />

            {/* {doi| doi:|}*/}
            <Partials.DoiCitationView doi={record.doi} />
        </span>
    );
};
PreprintCitation.propTypes = {
    publication: PropTypes.object.isRequired,
    citationStyle: PropTypes.string,
};
export default React.memo(PreprintCitation);
