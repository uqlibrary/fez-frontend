import React from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import RelatedPublications from './RelatedPublications';

const AvailableVersions = ({ publication, showPublicationTitle = true }) => {
    return (
        <RelatedPublications
            publication={{
                ...publication,
                fez_record_search_key_isderivationof: [
                    // filter out unpublished children
                    ...(publication.fez_record_search_key_isderivationof?.filter(i => i?.parent?.rek_status === 2) ||
                        []),
                ],
            }}
            title={locale.viewRecord.sections.availableVersions}
            className="availableVersions"
            parentSearchKey={{
                key: 'fez_record_search_key_isderivationof',
                pid: 'rek_isderivationof',
                title: 'rek_isderivationof_lookup',
                order: 'rek_isderivationof_order',
            }}
            // TODO unset childrenSearchKey upon circular linking all related pubs.
            childrenSearchKey={{
                key: 'fez_record_search_key_has_derivations',
                pid: 'rek_has_derivations',
                title: 'rek_has_derivations_lookup',
                order: 'rek_has_derivations_order',
            }}
            showPublicationTitle={showPublicationTitle}
        />
    );
};

AvailableVersions.propTypes = {
    publication: PropTypes.object.isRequired,
    showPublicationTitle: PropTypes.bool,
};

export default AvailableVersions;
