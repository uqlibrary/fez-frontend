import React from 'react';
import PropTypes from 'prop-types';
import PageCitationView from './PageCitationView';

const hasPageKey = (publication, key, subkey) => publication[key] && publication[key][subkey];

const PageRangeCitationView = ({ publication, searchKey, className, prefix, suffix }) => {
    const startPage = hasPageKey(publication, searchKey.startPage.key, searchKey.startPage.subkey) && (
        <PageCitationView publication={publication} searchKey={searchKey.startPage} className="citationStartPage" />
    );
    const endPage = hasPageKey(publication, searchKey.endPage.key, searchKey.endPage.subkey) && (
        <PageCitationView publication={publication} searchKey={searchKey.endPage} className="citationEndPage" />
    );

    return (
        <span className={`${className}${!startPage && !endPage ? ' empty' : ''}`}>
            {startPage || endPage ? prefix : ' '}
            {startPage}
            {startPage && endPage && '-'}
            {endPage}
            {startPage || endPage ? suffix : ' '}
        </span>
    );
};

PageRangeCitationView.propTypes = {
    publication: PropTypes.object.isRequired,
    className: PropTypes.string,
    searchKey: PropTypes.object,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
};

PageRangeCitationView.defaultProps = {
    searchKey: {
        startPage: {
            key: 'fez_record_search_key_start_page',
            subkey: 'rek_start_page',
        },
        endPage: {
            key: 'fez_record_search_key_end_page',
            subkey: 'rek_end_page',
        },
    },
    className: 'citationPageRange',
    prefix: '',
    suffix: '.',
};

export default React.memo(PageRangeCitationView);
