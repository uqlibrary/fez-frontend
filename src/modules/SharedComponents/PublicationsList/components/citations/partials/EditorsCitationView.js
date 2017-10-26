import React from 'react';
import PropTypes from 'prop-types';
import AuthorsCitationView from './AuthorsCitationView';

const EditorsCitationView = ({publication, prefix = 'edited by', suffix = '.'}) => {
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
            }}/>
    );
};

EditorsCitationView.propTypes = {
    publication: PropTypes.object.isRequired,
    prefix: PropTypes.string,
    suffix: PropTypes.string
};

export default EditorsCitationView;
