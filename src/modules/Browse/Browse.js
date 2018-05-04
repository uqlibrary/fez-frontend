import React from 'react';
import PropTypes from 'prop-types';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';

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
