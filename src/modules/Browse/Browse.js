import React from 'react';
import PropTypes from 'prop-types';
import {StandardPage, StandardCard} from 'uqlibrary-react-toolbox';
import {PublicationsList} from '../PublicationsList';
import {externalTitleSearchResultsList} from 'mock/data/publicationSearch';

export default function Browse({title, text, help}) {
    return (
        <StandardPage title={title}>
            <StandardCard title={title} help={help}>
                {text}
            </StandardCard>

            <StandardCard title="External search results">
                <PublicationsList publicationsList={externalTitleSearchResultsList} />
            </StandardCard>
        </StandardPage>
    );
}

Browse.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    help: PropTypes.shape({
        title: PropTypes.string,
        text: PropTypes.any,
        buttonLabel: PropTypes.string
    })
};

