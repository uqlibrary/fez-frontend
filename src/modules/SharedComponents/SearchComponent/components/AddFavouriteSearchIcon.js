import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import PropTypes from 'prop-types';

import IconButton from '@mui/material/IconButton';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import Tooltip from '@mui/material/Tooltip';

import { locale } from 'locale';
import { useConfirmationState } from 'hooks';
import { useAccountContext } from 'context';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { addFavouriteSearch } from 'actions';

export const FvsDescription = React.forwardRef((props, ref) => (
    <TextField ref={ref} textFieldId="fvs-description" fullWidth onChange={props.onChange} />
));

FvsDescription.propTypes = {
    onChange: PropTypes.func,
};

export const AddFavouriteSearchIcon = () => {
    const dispatch = useDispatch();
    const favouriteSearchAddSuccess = useSelector(
        state => state.get('favouriteSearchReducer').favouriteSearchAddSuccess,
    );
    const publicationsListLoaded = useSelector(state => state.get('searchRecordsReducer').publicationsList.length > 0);

    const location = useLocation();
    const { account } = useAccountContext();
    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();
    const descriptionInputRef = React.createRef(null);

    const txt = locale.components.searchComponent.advancedSearch.favouriteSearch;
    const redirectedFromNotFound = (!!location.state && !!location.state.redirectedFromNotFound) || false;

    const handleFavouriteSearchSave = () => {
        dispatch(
            addFavouriteSearch({
                fvs_search_parameters: `${location.pathname}${location.search}`,
                fvs_description: descriptionInputRef.current,
                fvs_username: account.id,
            }),
        );
    };

    const handleFavouriteSearchDescriptionChange = event => {
        descriptionInputRef.current = event.target.value;
    };

    return (
        <div id="add-favourite-search" data-testid="add-favourite-search" style={{ display: 'inline' }}>
            {!!publicationsListLoaded && (
                <ConfirmationBox
                    actionButtonColor="primary"
                    actionButtonVariant="contained"
                    cancelButtonColor="secondary"
                    confirmationBoxId="favourite-search-save"
                    onAction={handleFavouriteSearchSave}
                    onClose={hideConfirmation}
                    onCancelAction={hideConfirmation}
                    isOpen={isOpen}
                    locale={txt.inputForm}
                    showInputForm
                    InputForm={() => (
                        <FvsDescription ref={descriptionInputRef} onChange={handleFavouriteSearchDescriptionChange} />
                    )}
                />
            )}
            {!!publicationsListLoaded && !favouriteSearchAddSuccess && !redirectedFromNotFound && (
                <Tooltip title={txt.favouriteSearchHint}>
                    <span>
                        <IconButton
                            onClick={showConfirmation}
                            id="favourite-search-save"
                            data-analyticsid="favourite-search-save"
                            data-testid="favourite-search-save"
                            size="large"
                        >
                            <StarBorderIcon color="primary" />
                        </IconButton>
                    </span>
                </Tooltip>
            )}
            {((!!publicationsListLoaded && favouriteSearchAddSuccess) || redirectedFromNotFound) && (
                <Tooltip title={txt.favouriteSearchSaved}>
                    <span>
                        <IconButton
                            id="favourite-search-saved"
                            data-analyticsid="favourite-search-saved"
                            data-testid="favourite-search-saved"
                            disabled
                            size="large"
                        >
                            <StarIcon color="primary" />
                        </IconButton>
                    </span>
                </Tooltip>
            )}
        </div>
    );
};

export default AddFavouriteSearchIcon;
