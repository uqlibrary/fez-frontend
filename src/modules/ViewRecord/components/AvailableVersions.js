import React from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import RelatedPublications from './RelatedPublications';

const AvailableVersions = ({publication, showPublicationTitle = true}) => {
    return (
        <RelatedPublications
            publication={publication}
            title={locale.viewRecord.sections.availableVersions}
            className="availableVersions"
            searchKey={{
                key: 'fez_record_search_key_has_derivations',
                pid: 'rek_has_derivations',
                title: 'rek_has_derivations_lookup',
                order: 'rek_has_derivations_order'
            }}
            showPublicationTitle={showPublicationTitle}
        />
    );
};

AvailableVersions.propTypes = {
    publication: PropTypes.object.isRequired,
    showPublicationTitle: PropTypes.bool
};

export default AvailableVersions;
