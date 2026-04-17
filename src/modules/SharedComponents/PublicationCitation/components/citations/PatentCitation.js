import React from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export const PatentCitation = ({ publication, citationStyle }) => {
    const record = {
        id: publication.rek_pid,
        title: publication.rek_title,
        patentNumber: publication.fez_record_search_key_patent_number
            ? publication.fez_record_search_key_patent_number.rek_patent_number
            : null,
        doi: publication.fez_record_search_key_doi ? publication.fez_record_search_key_doi.rek_doi : null,
    };

    // eSpace citation view for Patent
    // {Creator}{Date of issue| (|).|y}<i>{Patent title| |.}</i>{Patent number| |.}
    return (
        <span id={`citation-content-${publication.rek_pid}`} className="citationContent citationPatent">
            {/* {Creator} */}
            <Partials.AuthorsCitationView citationStyle={citationStyle} publication={publication} />

            {/* {Date of issue| (|).|y} */}
            <Partials.DateCitationView date={publication.rek_date} />

            {/* {Title of patent} */}
            <Partials.CitationTitleView className="citationTitle" value={record.title} prefix=" " suffix="." />

            {/* {Patent number| |.}*/}
            <Partials.CitationView className="citationPatentNumber" value={record.patentNumber} prefix=" " suffix="." />

            {/* {doi| doi:|}*/}
            <Partials.DoiCitationView doi={record.doi} />
        </span>
    );
};
PatentCitation.propTypes = {
    publication: PropTypes.object.isRequired,
    citationStyle: PropTypes.string,
};
export default React.memo(PatentCitation);
