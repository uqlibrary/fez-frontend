import React from 'react';
import PropTypes from 'prop-types';

import Backdrop from '@mui/material/Backdrop';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

const ManageDialog = ({ isOpen = false, vocab, onClose }) => {
    console.log(vocab);
    return (
        <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={isOpen} onClick={onClose}>
            <StandardCard standardCardId="vocabulariesDialog" title="Manage Vocabularies" smallTitle>
                <h1>a form goes here</h1>
            </StandardCard>
        </Backdrop>
    );
};

ManageDialog.propTypes = {
    isOpen: PropTypes.bool,
    vocab: PropTypes.object,
    onClose: PropTypes.func.isRequired,
};
export default React.memo(ManageDialog);
