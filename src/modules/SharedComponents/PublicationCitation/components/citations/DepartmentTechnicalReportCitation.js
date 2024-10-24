import React from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export const DepartmentTechnicalReportCitation = ({ publication, hideDoiLink, citationStyle }) => {
    const record = {
        id: publication.rek_pid,
        title: publication.rek_title,
        series: publication.fez_record_search_key_series ? publication.fez_record_search_key_series.rek_series : null,
        reportNumber: publication.fez_record_search_key_report_number
            ? publication.fez_record_search_key_report_number.rek_report_number
            : null,
        orgUnitName: publication.fez_record_search_key_org_unit_name
            ? publication.fez_record_search_key_org_unit_name.rek_org_unit_name
            : null,
        orgName: publication.fez_record_search_key_org_name
            ? publication.fez_record_search_key_org_name.rek_org_name
            : null,
        doi: publication.fez_record_search_key_doi ? publication.fez_record_search_key_doi.rek_doi : null,
    };

    // eSpace citation view for Department Technical Report
    return (
        <div className="citationContent citationDepartmentTechnicalReport">
            {/* {Author}*/}
            <Partials.AuthorsCitationView citationStyle={citationStyle} publication={publication} />

            {/* {Year| (|).}*/}
            <Partials.DateCitationView date={publication.rek_date} />

            {/* <i>{Title| |.}</i> */}
            <Partials.CitationTitleView className="citationTitle" value={record.title} />

            {/* {Series Title| |,} */}
            <Partials.CitationView className="citationSeries" value={record.series} suffix=", " />

            {/* {Report Number| |.} */}
            <Partials.CitationView className="citationReportNumber" value={record.reportNumber} />

            {/* {School, Centre or Institute| |,} */}
            <Partials.CitationView className="citationOrgUnit" value={record.orgUnitName} suffix=", " />

            {/* {Institution| |.} */}
            <Partials.CitationView className="citationOrgName" value={record.orgName} />

            {/* {doi| doi:|}*/}
            <Partials.DoiCitationView doi={record.doi} hideDoiLink={hideDoiLink} />
        </div>
    );
};
DepartmentTechnicalReportCitation.propTypes = {
    publication: PropTypes.object.isRequired,
    hideDoiLink: PropTypes.bool,
    citationStyle: PropTypes.string,
};
export default React.memo(DepartmentTechnicalReportCitation);
