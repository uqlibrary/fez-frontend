import React from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export const AudioDocumentCitation = ({ publication, citationStyle }) => {
    const record = {
        id: publication.rek_pid,
        title: publication.rek_title,
        publisher: publication.fez_record_search_key_publisher
            ? publication.fez_record_search_key_publisher.rek_publisher
            : null,
        doi: publication.fez_record_search_key_doi ? publication.fez_record_search_key_doi.rek_doi : null,
        series: publication.fez_record_search_key_series ? publication.fez_record_search_key_series.rek_series : null,
    };

    // eSpace citation view for Audio
    // {Creator}{Publication Year| (|).} <i>{Title| |.}</i> {Publisher| |.}{Series| |.} {doi| doi:|}
    return (
        <span id={`citation-content-${publication.rek_pid}`} className="citationContent citationAudio">
            {/* {Creator}*/}
            <Partials.AuthorsCitationView citationStyle={citationStyle} publication={publication} />

            {/* {Publication Year| (|).} */}
            <Partials.DateCitationView date={publication.rek_date} />

            {/* <i>{Title| |.}</i> */}
            <Partials.CitationTitleView className="citationTitle" value={record.title} />

            {/* {Publisher| |.}*/}
            <Partials.CitationView className="citationPublisher" value={record.publisher} />

            {/* {Series| |.} */}
            <Partials.CitationView className="citationSeries" value={record.series} />

            {/* {doi| doi:|}*/}
            <Partials.DoiCitationView doi={record.doi} />
        </span>
    );
};

AudioDocumentCitation.propTypes = {
    publication: PropTypes.object.isRequired,
    citationStyle: PropTypes.string,
};

export default React.memo(AudioDocumentCitation);
