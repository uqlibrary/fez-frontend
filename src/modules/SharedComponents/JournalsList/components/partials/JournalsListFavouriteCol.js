import React from 'react';
import { useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import NotFavoriteIcon from '@material-ui/icons/FavoriteBorder';
import DisabledIcon from '@material-ui/icons/Favorite';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import { styled } from '@material-ui/core/styles';
import { toggleFavouriteJournal } from '../../../../../actions';

const FavoriteIcon = styled(DisabledIcon)(({ theme }) => ({
    color: theme.palette.primary.main,
}));

// eslint-disable-next-line react/prop-types
const ConditionalTooltip = ({ disabled, children, ...props }) =>
    !disabled ? <Tooltip {...props}>{children}</Tooltip> : children;

const JournalsListFavouriteCol = ({ journal, isFavourite = false, disabled = false }) => {
    const dispatch = useDispatch();
    const handleToggleFavouriteClick = () => {
        dispatch(toggleFavouriteJournal(journal.jnl_jid, isFavourite));
    };
    return (
        <Grid
            container
            spacing={0}
            id={`journal-list-fav-${journal.jnl_jid}`}
            alignItems="flex-end"
            alignContent="flex-end"
            style={{ marginTop: 0, borderBottom: '1px dashed #e6e6e6', height: 44 }}
        >
            <Grid
                key={journal.jnl_jid}
                item
                style={{
                    height: 44,
                    borderLeft: '1px dashed #e6e6e6',
                }}
            >
                <ConditionalTooltip
                    title={`Click to add - ${journal.jnl_title} - to your favourites`}
                    placement="left"
                    disabled={disabled}
                >
                    <IconButton
                        style={{ padding: 4, marginLeft: 6, marginTop: 2 }}
                        id={`journal-list-fav-button-${journal.jnl_jid}`}
                        onClick={handleToggleFavouriteClick}
                        disabled={disabled}
                    >
                        {!disabled && !isFavourite && <NotFavoriteIcon />}
                        {disabled && <DisabledIcon />}
                        {!disabled && isFavourite && <FavoriteIcon />}
                    </IconButton>
                </ConditionalTooltip>
            </Grid>
        </Grid>
    );
};

JournalsListFavouriteCol.propTypes = {
    journal: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    isFavourite: PropTypes.bool,
};

export default React.memo(JournalsListFavouriteCol);
