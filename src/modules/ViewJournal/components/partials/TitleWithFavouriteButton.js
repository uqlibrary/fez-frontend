import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from 'actions';

import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import Tooltip from '@material-ui/core/Tooltip';

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

    const { journal, tooltips, handlers } = props;
    const [busy, setIsBusy] = React.useState(false);
    const [active, setActive] = React.useState(!!journal.jnl_favourite === true);
    const dispatch = useDispatch();

    const onClickFavouriteButtonHandler = isAddingFavourite => {
        setIsBusy(true);
        let newActive = isAddingFavourite;

        const dispatchAction = isAddingFavourite
            ? actions.addToFavourites([journal.jnl_jid])
            : actions.removeFromFavourites([journal.jnl_jid]);

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
                    onClick={() => onClickFavouriteButtonHandler(!active)}
                    size="small"
                    disabled={busy}
                    className={classes.iconButton}
                >
                    {active && <StarIcon color="primary" className={classes.iconButtonSvg} />}
                    {!active && <StarBorderIcon color="primary" className={classes.iconButtonSvg} />}
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
    handlers: PropTypes.shape({
        errorUpdatingFavourite: PropTypes.func.isRequired,
    }).isRequired,
};

export default TitleWithFavouriteButton;
