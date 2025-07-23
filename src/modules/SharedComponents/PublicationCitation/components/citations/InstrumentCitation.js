import React from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export const InstrumentCitation = ({ publication, hideDoiLink, citationStyle }) => {
    const record = {
        id: publication.rek_pid,
        title: publication.rek_title,
        collectionType: publication.rek_display_type_lookup || null,
        publisher: publication.fez_record_search_key_publisher
            ? publication.fez_record_search_key_publisher.rek_publisher
            : null,
        doi: publication.fez_record_search_key_doi ? publication.fez_record_search_key_doi.rek_doi : null,
    };

    // eSpace citation view for Instrument
    // {Manufacturer name}{Publication Year| (|).}<i>{Instrument Title| |.}</i>{Publisher| |.} {doi| doi:|}

    return (
        <div className="citationContent citationInstrument">
            {/* {Manufacturer} */}
            <Partials.AuthorsCitationView citationStyle={citationStyle} publication={publication} suffix="" />

            {/* {Publication Year| (|).} */}
            <Partials.DateCitationView date={publication.rek_date} />

            {/* <i>{Instrument Title| |.}</i> */}
            <Partials.CitationTitleView className="citationTitle" value={record.title} />

            {/* {Publisher| |.} */}
            <Partials.CitationView className="citationPublisher" value={record.publisher} />

            {/* {doi| doi:|} */}
            <Partials.DoiCitationView doi={record.doi} hideDoiLink={hideDoiLink} />
        </div>
    );
};
InstrumentCitation.propTypes = {
    publication: PropTypes.object.isRequired,
    hideDoiLink: PropTypes.bool,
    citationStyle: PropTypes.string,
};
export default React.memo(InstrumentCitation);
