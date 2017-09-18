import React from 'react';
import PropTypes from 'prop-types';

const PageRangeCitationView = ({publication, searchKey, className, prefix, suffix}) => {
    const startPage = publication[searchKey.startPage.key] ? publication[searchKey.startPage.key][searchKey.startPage.subkey] : null;
    const endPage = publication[searchKey.endPage.key] ? publication[searchKey.endPage.key][searchKey.endPage.subkey] : null;

    return (
        <span className={className}>
            {
                (startPage || endPage) ? prefix : ''
            }
            {
                startPage &&
                <span className="citationStartPage">
                    {startPage}{endPage ? '-' : '' }
                </span>
            }
            {
                endPage &&
                <span className="citationEndPage">{endPage}</span>
            }
            {
                (startPage || endPage) ? suffix : ''
            }
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
