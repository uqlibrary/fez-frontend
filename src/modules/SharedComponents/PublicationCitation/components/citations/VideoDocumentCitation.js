import React from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export const VideoDocumentCitation = ({ publication, citationStyle }) => {
    const record = {
        id: publication.rek_pid,
        title: publication.rek_title,
        doi: publication.fez_record_search_key_doi ? publication.fez_record_search_key_doi.rek_doi : null,
        series: publication.fez_record_search_key_series ? publication.fez_record_search_key_series.rek_series : null,
    };

    // eSpace citation view for Video
    // {Creator}{Year| (|).}<i>{Title| |.}</i>{Series| |.}
    return (
        <div className="citationContent citationVideo">
            {/* {Creator}*/}
            <Partials.AuthorsCitationView citationStyle={citationStyle} publication={publication} />

            {/* {Year| (|).} */}
            <Partials.DateCitationView date={publication.rek_date} />

            {/* <i>{Title| |.}</i> */}
            <Partials.CitationTitleView className="citationTitle" value={record.title} />

            {/* {Series| |.} */}
            <Partials.CitationView className="citationSeries" value={record.series} />

            {/* {doi| doi:|}*/}
            <Partials.DoiCitationView doi={record.doi} />
        </div>
    );
};
VideoDocumentCitation.propTypes = {
    publication: PropTypes.object.isRequired,
    citationStyle: PropTypes.string,
};
export default React.memo(VideoDocumentCitation);
