import React from 'react';
import PropTypes from 'prop-types';
import FreeTextForm from './FreeTextForm';

export const IssnForm = props => {
    const onAdd = !!props.onAdd ? props.onAdd : props.onSubmit;
    const indexFinder = (list, item) => list.findIndex(listItem => listItem.key === item.key);

    const handleSubmit = item => {
        onAdd(
            {
                key: item,
                value: {
                    sherpaRomeo: { link: false },
                    ulrichs: { link: false, linkText: '' },
                },
            },
            indexFinder,
        );
    };

    return (
        <FreeTextForm
            {...props}
            onAdd={handleSubmit}
            onSubmit={handleSubmit}
            itemSelectedToEdit={(!!props.itemSelectedToEdit && props.itemSelectedToEdit.key) || ''}
        />
    );
};

IssnForm.propTypes = {
    itemSelectedToEdit: PropTypes.object,
    onAdd: PropTypes.func,
    onSubmit: PropTypes.func,
};

export default IssnForm;
