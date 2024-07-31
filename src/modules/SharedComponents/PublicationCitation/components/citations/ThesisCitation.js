import React from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export const ThesisCitation = ({ publication, hideDoiLink, citationStyle }) => {
    const record = {
        id: publication.rek_pid,
        title: publication.rek_title,
        thesisType: publication.rek_genre_type || null,
        orgUnit: publication.fez_record_search_key_org_unit_name
            ? publication.fez_record_search_key_org_unit_name.rek_org_unit_name
            : null,
        orgName: publication.fez_record_search_key_org_name
            ? publication.fez_record_search_key_org_name.rek_org_name
            : null,
        doi: publication.fez_record_search_key_doi ? publication.fez_record_search_key_doi.rek_doi : null,
    };

    // eSpace citation view for Thesis
    // {Author}{Year| (|).}<i>{Title| |.}</i>{Thesis type| |,}{School, Centre or Institute| |,}{Institution| |.} {doi| https://doi.org/|}

    return (
        <div className="citationContent citationThesis">
            {/* {Author}*/}
            <Partials.AuthorsCitationView citationStyle={citationStyle} publication={publication} />

            {/* {Year| (|).}*/}
            <Partials.DateCitationView date={publication.rek_date} />

            {/* <i>{Title| |.}</i> */}
            <Partials.CitationTitleView className="citationTitle" value={record.title} />

            {/* {Thesis type| |,} */}
            <Partials.CitationView className="citationThesisType" value={record.thesisType} suffix="," />

            {/* {School, Centre or Institute| |,} */}
            <Partials.CitationView className="citationOrgUnit" value={record.orgUnit} suffix="," />

            {/* {Institution| |.} */}
            <Partials.CitationView className="citationOrgName" value={record.orgName} />

            {/* {doi| doi:|}*/}
            <Partials.DoiCitationView doi={record.doi} hideDoiLink={hideDoiLink} />
        </div>
    );
};
ThesisCitation.propTypes = {
    publication: PropTypes.object.isRequired,
    hideDoiLink: PropTypes.bool,
    citationStyle: PropTypes.string,
};
export default React.memo(ThesisCitation);
