import React from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export const DesignCitation = ({ publication, citationStyle }) => {
    const record = {
        id: publication.rek_pid,
        title: publication.rek_title,
        source: publication.fez_record_search_key_source ? publication.fez_record_search_key_source.rek_source : null,
        doi: publication.fez_record_search_key_doi ? publication.fez_record_search_key_doi.rek_doi : null,
    };

    // eSpace citation view for Design
    // {Creator}{Publication Year| (|).}<i>{Title| |.}</i>{Source| |.}

    return (
        <div className="citationContent citationDesign">
            {/* {Creator} */}
            <Partials.AuthorsCitationView citationStyle={citationStyle} publication={publication} />

            {/* {Publication Year| (|).} */}
            <Partials.DateCitationView date={publication.rek_date} />

            {/* <i>{Title| |.}</i> */}
            <Partials.CitationTitleView className="citationTitle" value={record.title} />

            {/* {Source| |.} */}
            <Partials.CitationView className="citationSource" value={record.source} />

            {/* {doi| doi:|}*/}
            <Partials.DoiCitationView doi={record.doi} />
        </div>
    );
};
DesignCitation.propTypes = {
    publication: PropTypes.object.isRequired,
    citationStyle: PropTypes.string,
};
export default React.memo(DesignCitation);
