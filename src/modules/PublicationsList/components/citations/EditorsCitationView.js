import React from 'react';
import PropTypes from 'prop-types';
import AuthorsCitationView from './AuthorsCitationView';

const EditorsCitationView = ({publication, searchKey}) => {
    const authorsCount = Array.isArray(publication[searchKey.key]) ? publication[searchKey.key].length : 0;
    const authorsCitation = <AuthorsCitationView publication={publication} searchKey={searchKey} />;

    return authorsCount === 0 ? authorsCitation : <span>Edited by {authorsCitation}</span>;
};

EditorsCitationView.propTypes = {
    publication: PropTypes.object.isRequired,
    searchKey: PropTypes.object
};

EditorsCitationView.defaultProps = {
    searchKey: {key: 'fez_record_search_key_contributor', subkey: 'rek_contributor', order: 'rek_contributor_order'}
    // TODO: link to contributor: idSearchKey: {key: 'fez_record_search_key_contributor_id', subkey: 'rek_contributor_id'}
};

export default EditorsCitationView;
