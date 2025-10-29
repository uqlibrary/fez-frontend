import React from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export const DataCollectionCitation = ({ publication, hideDoiLink, citationStyle }) => {
    const record = {
        id: publication.rek_pid,
        title: publication.rek_title,
        publisher: publication.fez_record_search_key_publisher
            ? publication.fez_record_search_key_publisher.rek_publisher
            : null,
        collectionType: publication.rek_display_type_lookup || null,
        doi: publication.fez_record_search_key_doi ? publication.fez_record_search_key_doi.rek_doi : null,
    };

    // eSpace citation view for DataCollection
    // {Creator name}{Publication Year| (|).}<i>{Dataset Title| |.}</i>{Publisher| |.} Collection Type. {doi| doi:|}

    return (
        <span id={`citation-content-${publication.rek_pid}`} className="citationContent citationDataCollection">
            {/* {Creator} */}
            <Partials.AuthorsCitationView citationStyle={citationStyle} publication={publication} suffix="" />

            {/* {Publication Year| (|).} */}
            <Partials.DateCitationView date={publication.rek_date} />

            {/* <i>{Dataset Title| |.}</i> */}
            <Partials.CitationTitleView className="citationTitle" value={record.title} />

            {/* {Publisher| |.} */}
            <Partials.CitationView className="citationPublisher" value={record.publisher} />

            {/* {Collection Type| (|).} */}
            <Partials.CitationView className="citationCollectionType" value={record.collectionType} />

            {/* {doi| doi:|} */}
            <Partials.DoiCitationView doi={record.doi} hideDoiLink={hideDoiLink} />
        </span>
    );
};
DataCollectionCitation.propTypes = {
    publication: PropTypes.object.isRequired,
    hideDoiLink: PropTypes.bool,
    citationStyle: PropTypes.string,
};
export default React.memo(DataCollectionCitation);
