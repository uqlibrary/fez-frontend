import React from 'react';
import PropTypes from 'prop-types';
import PageCitationView from './PageCitationView';

const PageRangeCitationView = ({publication, searchKey, className, prefix, suffix}) => {
    const startPage = publication[searchKey.startPage.key] &&
        <PageCitationView publication={publication} searchKey={searchKey.startPage} className="citationStartPage"/>;
    const endPage = publication[searchKey.endPage.key] &&
        <PageCitationView publication={publication} searchKey={searchKey.endPage} className="citationEndPage"/>;

    return (
        <span className={className}>
            {(startPage || endPage) ? prefix : ''}
            {startPage}
            {endPage && '-'}
            {endPage}
            {(startPage || endPage) ? suffix : ''}
        </span>
    );
};

PageRangeCitationView.propTypes = {
    publication: PropTypes.object.isRequired,
    className: PropTypes.string,
    searchKey: PropTypes.object,
    prefix: PropTypes.string,
    suffix: PropTypes.string
};

PageRangeCitationView.defaultProps = {
    searchKey: {
        startPage: {
            key: 'fez_record_search_key_start_page',
            subkey: 'rek_start_page'
        },
        endPage: {
            key: 'fez_record_search_key_end_page',
            subkey: 'rek_end_page'
        }
    },
    className: 'citationPageRange'
};

export default PageRangeCitationView;
