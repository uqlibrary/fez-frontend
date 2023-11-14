import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import { useIsMobileView } from 'hooks';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import Tooltip from '@mui/material/Tooltip';
import Icon from '@mui/material/Icon';

import AdminActions from './AdminActions';

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
    const { journal, tooltips, actions, handlers, showAdminActions = false } = props;
    const [isBusy, setIsBusy] = React.useState(false);
    const [active, setActive] = React.useState(!!journal.is_favourite === true);
    const dispatch = useDispatch();
    const isMobileView = useIsMobileView();

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
        <Grid container padding={0} spacing={0}>
            <Grid item xs={showAdminActions ? 10 : 12} sm={showAdminActions ? 11 : 12}>
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
            </Grid>
            {!!showAdminActions && (
                <Grid item xs={2} sm={1} sx={{ display: 'flex', alignItems: 'center' }}>
                    <AdminActions
                        journal={journal}
                        navigatedFrom={
                            (location.hash && location.hash.replace('#', '')) ||
                            `${location.pathname}${location.search}`
                        }
                        sx={{ marginLeft: 'auto' }}
                        size={!isMobileView ? 'large' : 'small'}
                    />
                </Grid>
            )}
        </Grid>
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
    showAdminActions: PropTypes.bool,
};

export default TitleWithFavouriteButton;
