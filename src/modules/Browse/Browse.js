import React from 'react';
import PropTypes from 'prop-types';
import {StandardPage} from 'uqlibrary-react-toolbox/build/StandardPage';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';

export default function Browse({title, text, help}) {
    return (
        <StandardPage title={title}>
            <StandardCard title={title} help={help}>
                {text}
            </StandardCard>
        </StandardPage>
    );
}

Browse.propTypes = {
    title: PropTypes.string,
    text: PropTypes.object,
    help: PropTypes.shape({
        title: PropTypes.string,
        text: PropTypes.any,
        buttonLabel: PropTypes.string
    })
};
