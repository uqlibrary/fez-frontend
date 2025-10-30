import React from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export const ResearchReportCitation = ({ publication, hideDoiLink, citationStyle }) => {
    const record = {
        id: publication.rek_pid,
        title: publication.rek_title,
        publisher: publication.fez_record_search_key_publisher
            ? publication.fez_record_search_key_publisher.rek_publisher
            : null,
        placeOfPublication: publication.fez_record_search_key_place_of_publication
            ? publication.fez_record_search_key_place_of_publication.rek_place_of_publication
            : null,
        doi: publication.fez_record_search_key_doi ? publication.fez_record_search_key_doi.rek_doi : null,
        series: publication.fez_record_search_key_series ? publication.fez_record_search_key_series.rek_series : null,
    };

    // eSpace citation view for ResearchReport
    return (
        <span id={`citation-content-${publication.rek_pid}`} className="citationContent citationResearchReport">
            {/* authors list */}
            <Partials.AuthorsCitationView citationStyle={citationStyle} publication={publication} />

            {/* publication year */}
            <Partials.DateCitationView date={publication.rek_date} />

            {/* research report title */}
            <Partials.CitationTitleView className="citationTitle" value={record.title} />

            {/* series */}
            <Partials.CitationView className="citationSeries" value={record.series} />

            {/* place of publication */}
            <Partials.CitationView
                className="citationPlaceOfPublication"
                suffix=":"
                value={record.placeOfPublication}
            />

            {/* publisher */}
            <Partials.CitationView className="citationPublisher" value={record.publisher} />

            {/* doi */}
            <Partials.DoiCitationView doi={record.doi} hideDoiLink={hideDoiLink} />
        </span>
    );
};
ResearchReportCitation.propTypes = {
    publication: PropTypes.object.isRequired,
    hideDoiLink: PropTypes.bool,
    citationStyle: PropTypes.string,
};
export default React.memo(ResearchReportCitation);
