import React from 'react';
import PropTypes from 'prop-types';

const PageCitationView = ({ publication, searchKey, className = 'citationPage' }) => {
    const page = publication[searchKey.key] ? publication[searchKey.key][searchKey.subkey] : null;
    return page && <span className={className}>{page}</span>;
};

PageCitationView.propTypes = {
    publication: PropTypes.object.isRequired,
    searchKey: PropTypes.object.isRequired,
    className: PropTypes.string,
};

export default React.memo(PageCitationView);
