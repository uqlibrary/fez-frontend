import React from 'react';
import {PropTypes} from 'prop-types';
import {StandardPage, StandardCard} from 'uqlibrary-react-toolbox';
import {PublicationForm} from '../PublicationForm';

export default function Browse({title, text, help}) {
    return (
        <StandardPage title={title}>
            <StandardCard title={title} help={help}>
                {text}
            </StandardCard>

            <PublicationForm onFormSubmitSuccess={()=>{ console.log('success!');}} onFormCancel={()=>{ console.log('good bye!');}} />

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

