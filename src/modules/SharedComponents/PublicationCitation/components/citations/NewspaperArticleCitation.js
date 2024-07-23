import React from 'react';
import PropTypes from 'prop-types';
import * as Partials from './partials';

export const NewspaperArticleCitation = ({ publication, citationStyle }) => {
    const record = {
        id: publication.rek_pid,
        title: publication.rek_title,
        newspaper: publication.fez_record_search_key_newspaper
            ? publication.fez_record_search_key_newspaper.rek_newspaper
            : null,
        startPage: publication.fez_record_search_key_start_page
            ? publication.fez_record_search_key_start_page.rek_start_page
            : null,
        endPage: publication.fez_record_search_key_end_page
            ? publication.fez_record_search_key_end_page.rek_end_page
            : null,
        doi: publication.fez_record_search_key_doi ? publication.fez_record_search_key_doi.rek_doi : null,
    };

    // eSpace citation view for Newspaper Article
    // {Author}{Publication Date| (|).|y, m d}{Title| |.}<i>{Newspaper| |}</i>{Start page| , |}{End page|-|}

    return (
        <div className="citationContent citationNewspaperArticle">
            {/* {Author} */}
            <Partials.AuthorsCitationView citationStyle={citationStyle} publication={publication} />

            {/* {Publication Date| (|).|Y, m d} */}
            <Partials.DateCitationView date={publication.rek_date} format="YYYY[,] MMMM D" />

            {/* {Title| |.} */}
            <Partials.CitationTitleView className="citationNewspaperArticleTitle" value={record.title} />

            {/* <i>{Newspaper| |}</i> */}
            <Partials.CitationView className="citationNewspaper" value={record.newspaper} suffix="" />

            {/* {Start page| , |} */}
            <Partials.CitationView className="citationStartPage" value={record.startPage} prefix=", " suffix="" />

            {/* {End page|-|} */}
            <Partials.CitationView className="citationEndPage" value={record.endPage} prefix="-" />

            {/* {doi| doi:|}*/}
            <Partials.DoiCitationView doi={record.doi} />
        </div>
    );
};
NewspaperArticleCitation.propTypes = {
    publication: PropTypes.object.isRequired,
    citationStyle: PropTypes.string,
};
export default React.memo(NewspaperArticleCitation);
