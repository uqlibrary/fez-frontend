import React from 'react';
import PropTypes from 'prop-types';
import FreeTextForm from './FreeTextForm';

export const IssnForm = props => {
    const onAdd = item => {
        props.onAdd({
            key: item,
            value: {
                sherpaRomeo: { link: false },
                ulrichs: { link: false, linkText: '' },
            },
        });
    };
    return <FreeTextForm {...props} onAdd={onAdd} />;
};

IssnForm.propTypes = {
    onAdd: PropTypes.func.isRequired,
};

export default IssnForm;
