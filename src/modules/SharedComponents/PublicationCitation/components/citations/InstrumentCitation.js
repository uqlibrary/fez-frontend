import React from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export const InstrumentCitation = ({ publication, hideDoiLink, citationStyle }) => {
    const record = {
        id: publication.rek_pid,
        title: publication.rek_title,
        collectionType: publication.rek_display_type_lookup || null,
        doi: publication.fez_record_search_key_doi ? publication.fez_record_search_key_doi.rek_doi : null,
    };

    // eSpace citation view for Instrument
    // {Manufacturer name}{Publication Year| (|).}<i>{Instrument Title| |.}</i> {doi| doi:|}

    return (
        <div className="citationContent citationInstrument">
            {/* {Manufacturer} */}
            <Partials.AuthorsCitationView citationStyle={citationStyle} publication={publication} suffix="" />

            {/* {Publication Year| (|).} */}
            <Partials.DateCitationView date={publication.rek_date} />

            {/* <i>{Instrument Title| |.}</i> */}
            <Partials.CitationTitleView className="citationTitle" value={record.title} />

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
