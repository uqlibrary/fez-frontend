import React from 'react';
import {PropTypes} from 'prop-types';
import {StandardPage, StandardCard} from 'uqlibrary-react-toolbox';

export default function Research({title, text, help}) {
    return (
        <StandardPage title={title}>
            <StandardCard title={title} help={help}>
                {text}
            </StandardCard>
        </StandardPage>
    );
}
Research.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    help: PropTypes.object
};
