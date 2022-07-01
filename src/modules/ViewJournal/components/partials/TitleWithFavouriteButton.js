import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';

import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    iconButton: {
        verticalAlign: 'top',
    },
    iconButtonSvg: {
        [theme.breakpoints.up('sm')]: {
            width: '1.4em',
            height: '1.4em',
        },
    },
}));

const TitleWithFavouriteButton = props => {
    const classes = useStyles();

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
                    data-testid={`favourite-journal-${active ? 'saved' : 'notsaved'}`}
                    component={isBusy ? 'div' : undefined}
                    onClick={!isBusy ? () => onClickFavouriteButtonHandler(!active) : undefined}
                    size="small"
                    disabled={isBusy}
                    className={classes.iconButton}
                    aria-label={active ? tooltips.favourite : tooltips.notFavourite}
                >
                    <Icon
                        id={`favourite-icon-${active ? 'saved' : 'notsaved'}`}
                        data-testid={`favourite-icon-${active ? 'saved' : 'notsaved'}`}
                        color="primary"
                        className={classes.iconButtonSvg}
                    >
                        {active && <StarIcon className={classes.iconButtonSvg} />}
                        {!active && <StarBorderIcon className={classes.iconButtonSvg} />}
                    </Icon>
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
