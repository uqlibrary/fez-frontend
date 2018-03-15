import React from 'react';
import PropTypes from 'prop-types';
import AuthorsCitationView from './AuthorsCitationView';

const EditorsCitationView = ({publication, prefix = ' edited by ', suffix = '. ', showLink = false, initialNumberOfEditors = 10}) => {
    return (
        <AuthorsCitationView
            publication={publication}
            className="citationEditors"
            prefix={prefix}
            suffix={suffix}
            searchKey={{
                key: 'fez_record_search_key_contributor',
                subkey: 'rek_contributor',
                order: 'rek_contributor_order'
            }}
            idSearchKey={{
                idKey: 'fez_record_search_key_contributor_id',
                idSubkey: 'rek_contributor_id',
                idOrder: 'rek_contributor_id_order'
            }}
            initialNumberOfAuthors={initialNumberOfEditors}
            showLink={showLink}
        />
    );
};

EditorsCitationView.propTypes = {
    publication: PropTypes.object.isRequired,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
    initialNumberOfEditors: PropTypes.number,
    showLink: PropTypes.bool
};

export default EditorsCitationView;
