import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import IconButton from '@mui/material/IconButton';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import Tooltip from '@mui/material/Tooltip';
import Icon from '@mui/material/Icon';

const StyledIcon = styled(Icon)(({ theme }) => ({
    [theme.breakpoints.up('sm')]: {
        width: '1.4em',
        height: '1.4em',
        '& .favourite-icon': {
            width: '100%',
            height: '100%',
        },
    },
}));

const TitleWithFavouriteButton = props => {
    const { journal, tooltips, actions, handlers } = props;
    const [isBusy, setIsBusy] = React.useState(false);
    const [active, setActive] = React.useState(!!journal.is_favourite === true);
    const dispatch = useDispatch();

    const onClickFavouriteButtonHandler = isAddingFavourite => {
        setIsBusy(true);
        let newActive = isAddingFavourite;

        const dispatchAction = isAddingFavourite
            ? actions.addFavourite([journal.jnl_jid])
            : actions.removeFavourite([journal.jnl_jid]);

        dispatch(dispatchAction)
            .catch(() => {
                handlers.errorUpdatingFavourite(true);
                newActive = !isAddingFavourite;
            })
            .then(() => {
                active !== newActive && setActive(newActive);
                setIsBusy(false);
            });
    };

    return (
        <>
            {journal.jnl_title}
            <Tooltip title={active ? tooltips.favourite : tooltips.notFavourite}>
                <IconButton
                    id={`favourite-journal-${active ? 'saved' : 'notsaved'}`}
                    data-analyticsid={`favourite-journal-${active ? 'saved' : 'notsaved'}`}
                    data-testid={`favourite-journal-${active ? 'saved' : 'notsaved'}`}
                    component={isBusy ? 'div' : undefined}
                    onClick={!isBusy ? () => onClickFavouriteButtonHandler(!active) : undefined}
                    size="small"
                    disabled={isBusy}
                    sx={{ verticalAlign: 'top' }}
                    aria-label={active ? tooltips.favourite : tooltips.notFavourite}
                >
                    <StyledIcon
                        id={`favourite-icon-${active ? 'saved' : 'notsaved'}`}
                        data-testid={`favourite-icon-${active ? 'saved' : 'notsaved'}`}
                        color="primary"
                    >
                        {active && <StarIcon className={'favourite-icon'} />}
                        {!active && <StarBorderIcon className={'favourite-icon'} />}
                    </StyledIcon>
                </IconButton>
            </Tooltip>
        </>
    );
};

TitleWithFavouriteButton.propTypes = {
    journal: PropTypes.object.isRequired,
    tooltips: PropTypes.shape({
        favourite: PropTypes.string.isRequired,
        notFavourite: PropTypes.string.isRequired,
    }).isRequired,
    actions: PropTypes.shape({
        addFavourite: PropTypes.func.isRequired,
        removeFavourite: PropTypes.func.isRequired,
    }).isRequired,
    handlers: PropTypes.shape({
        errorUpdatingFavourite: PropTypes.func.isRequired,
    }).isRequired,
};

export default TitleWithFavouriteButton;
