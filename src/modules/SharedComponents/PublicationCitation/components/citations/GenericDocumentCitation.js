import React from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export const GenericDocumentCitation = ({ publication, citationStyle }) => {
    const record = {
        id: publication.rek_pid,
        publisher: publication.fez_record_search_key_publisher
            ? publication.fez_record_search_key_publisher.rek_publisher
            : null,
        title: publication.rek_title ? publication.rek_title : null,
        doi: publication.fez_record_search_key_doi ? publication.fez_record_search_key_doi.rek_doi : null,
    };

    // eSpace citation view for Generic article
    // {Author}{Publication Year| (|).}<i>{Title| |.}</i>{Publisher| |.}
    return (
        <div className="citationContent citationGenericDocument">
            {/* {Author}*/}
            <Partials.AuthorsCitationView citationStyle={citationStyle} publication={publication} />

            {/* {Publication Year| (|).}*/}
            <Partials.DateCitationView date={publication.rek_date} />

            {/* <i>{Title| |.}</i>*/}
            <Partials.CitationTitleView className="citationTitle" value={record.title} />

            {/* {Publisher| |.} */}
            <Partials.CitationView className="citationPublisher" value={record.publisher} />

            {/* {doi| doi:|}*/}
            <Partials.DoiCitationView doi={record.doi} />
        </div>
    );
};
GenericDocumentCitation.propTypes = {
    publication: PropTypes.object.isRequired,
    citationStyle: PropTypes.string,
};
export default React.memo(GenericDocumentCitation);
