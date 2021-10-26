import * as React from 'react';
import { useState } from 'react';
import { PropTypes } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavourites } from '../../../../actions';
import locale from '../../../../locale/components';
import { LoadingButton } from '../../../SharedComponents/LoadingButton';
import { ConfirmationBox } from '../../../SharedComponents/Toolbox/ConfirmDialogBox';

export const AddToFavouritesButton = ({ selectedJournals, disabled, clearSelectedJournals }) => {
    const dispatch = useDispatch();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const txt = locale.components.journalSearch;
    const adding = useSelector(state => state.get?.('favouriteJournalsReducer').add.loading);

    const selectionCount = Object.keys(selectedJournals).length;
    const closeDialog = () => {
        setIsDialogOpen(false);
        clearSelectedJournals({});
    };

    const handleAddToFavouriteClick = () =>
        dispatch(addToFavourites(Object.keys(selectedJournals))).then(() => {
            setIsDialogOpen(true);
            setTimeout(closeDialog, 1000);
        });
    return (
        <>
            <ConfirmationBox
                testId="rek-doi-confirmation-box"
                confirmationBoxId="rek-doi"
                hideCancelButton
                isOpen={isDialogOpen}
                locale={{
                    ...txt.journalSearchInterface.confirmations.addToFavourites,
                    // eslint-disable-next-line max-len
                    confirmationMessage: selectionCount
                        ? txt.journalSearchInterface.confirmations.addToFavourites.confirmationMessage.replace(
                              'COUNT',
                              selectionCount,
                          )
                        : '',
                }}
                onClose={closeDialog}
            />
            <LoadingButton
                disabled={adding || disabled}
                loading={adding}
                onClick={handleAddToFavouriteClick}
                variant="contained"
                children={txt.journalSearchInterface.buttons.addToFavourites.title}
                aria-label={txt.journalSearchInterface.buttons.addToFavourites.aria}
                color="primary"
                id="add-to-favourites-button"
                data-testid="add-to-favourites-button"
                fullWidth
            />
        </>
    );
};

AddToFavouritesButton.propTypes = {
    selectedJournals: PropTypes.object,
    disabled: PropTypes.bool,
    clearSelectedJournals: PropTypes.func,
};

export default React.memo(AddToFavouritesButton);
