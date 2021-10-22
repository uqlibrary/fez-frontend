import * as React from 'react';
import { PropTypes } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavourites } from '../../../../actions';
import locale from '../../../../locale/components';
import { LoadingButton } from '../../../SharedComponents/LoadingButton';

export const AddToFavouritesButton = ({ selectedJournals, disabled, clearSelectedJournals }) => {
    const dispatch = useDispatch();
    const txt = locale.components.journalSearch;
    const adding = useSelector(state => state.get?.('favouriteJournalsReducer').addFavouritesLoading);

    const handleAddToFavouriteClick = () =>
        dispatch(addToFavourites(Object.keys(selectedJournals))).then(() => clearSelectedJournals({}));
    return (
        <>
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
