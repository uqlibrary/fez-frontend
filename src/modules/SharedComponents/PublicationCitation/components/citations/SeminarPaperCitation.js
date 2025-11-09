import React from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export const SeminarPaperCitation = ({ publication, citationStyle }) => {
    const record = {
        id: publication.rek_pid,
        title: publication.rek_title,
        series: publication.fez_record_search_key_series ? publication.fez_record_search_key_series.rek_series : null,
        orgUnit: publication.fez_record_search_key_org_unit_name
            ? publication.fez_record_search_key_org_unit_name.rek_org_unit_name
            : null,
        orgName: publication.fez_record_search_key_org_name
            ? publication.fez_record_search_key_org_name.rek_org_name
            : null,
        doi: publication.fez_record_search_key_doi ? publication.fez_record_search_key_doi.rek_doi : null,
    };

    // eSpace citation view for Seminar Paper
    // {Author}{Year| (|).}<i>{Title| |.}</i>{Seminar series| |.}{School, Centre or Institute| |,}{Institution| |.}
    return (
        <span id={`citation-content-${publication.rek_pid}`} className="citationContent citationSeminarPaper">
            {/* {Author}*/}
            <Partials.AuthorsCitationView citationStyle={citationStyle} publication={publication} />

            {/* {Publication Year| (|).} */}
            <Partials.DateCitationView date={publication.rek_date} />

            {/* <i>{Title| |.}</i> */}
            <Partials.CitationTitleView className="citationTitle" value={record.title} />

            {/* {Seminar series| |.} */}
            <Partials.CitationView className="citationSeries" value={record.series} />

            {/* {School, Centre or Institute| |,}  - fez_record_search_key_org_unit_name.rek_org_unit_name */}
            <Partials.CitationView className="citationOrgUnit" value={record.orgUnit} suffix="," />

            {/* {Institution| |.} - fez_record_search_key_org_name.rek_org_name */}
            <Partials.CitationView className="citationOrgName" value={record.orgName} />

            {/* {doi| doi:|}*/}
            <Partials.DoiCitationView doi={record.doi} />
        </span>
    );
};
SeminarPaperCitation.propTypes = {
    publication: PropTypes.object.isRequired,
    citationStyle: PropTypes.string,
};
export default React.memo(SeminarPaperCitation);
