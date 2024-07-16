import React from 'react';
import PropTypes from 'prop-types';
import AuthorsCitationView from './AuthorsCitationView';
import { pathConfig } from 'config/pathConfig';

const EditorsCitationView = ({
    citationStyle,
    publication,
    prefix = ' Edited by ',
    suffix = '. ',
    separator = ', ',
    showLink = false,
}) => {
    return (
        <AuthorsCitationView
            publication={publication}
            citationStyle={citationStyle}
            className="citationEditors"
            prefix={prefix}
            suffix={suffix}
            separator={separator}
            searchKey={{
                key: 'fez_record_search_key_contributor',
                totalCountKey: 'fez_record_search_key_contributor',
                subkey: 'rek_contributor',
                order: 'rek_contributor_order',
            }}
            idSearchKey={{
                idKey: 'fez_record_search_key_contributor_id',
                idSubkey: 'rek_contributor_id',
                idOrder: 'rek_contributor_id_order',
            }}
            showLink={showLink}
            getLink={pathConfig.list.contributor}
        />
    );
};

EditorsCitationView.propTypes = {
    citationStyle: PropTypes.string,
    publication: PropTypes.object.isRequired,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
    separator: PropTypes.string,
    initialNumberOfEditors: PropTypes.number,
    showLink: PropTypes.bool,
};

export default React.memo(EditorsCitationView);
