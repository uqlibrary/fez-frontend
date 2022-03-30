import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import locale from 'locale/components';
import { pathConfig } from 'config';
import { useHistory, useLocation } from 'react-router';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    buttonContainer: {
        [theme.breakpoints.up('md')]: {
            display: 'inline-flex',
        },
    },
}));

const CommonButtons = ({ onSearchAll, browseAllJournals: isBrowsingAllJournals = false }) => {
    const classes = useStyles();
    const location = useLocation();
    const history = useHistory();
    const txt = locale.components.searchJournals;
    const handleFavouriteJournalsClick = () => {
        history.push({
            pathname: pathConfig.journals.favourites,
            state: { prevLocation: location },
        });
    };
    return (
        <>
            <Grid item xs={12} sm={6} md={3} alignItems="stretch" className={classes.buttonContainer}>
                <Button
                    children={txt.journalSearchInterface.buttons.myFavouriteJournals.title}
                    aria-label={txt.journalSearchInterface.buttons.myFavouriteJournals.aria}
                    onClick={handleFavouriteJournalsClick}
                    id="journal-search-favourite-journals-button"
                    data-testid="journal-search-favourite-journals-button"
                    fullWidth
                />
            </Grid>
            {!isBrowsingAllJournals && (
                <Grid item xs={12} sm={6} md={3} alignItems="stretch" className={classes.buttonContainer}>
                    <Button
                        id="journal-search-browse-all-button"
                        data-testid="journal-search-browse-all-button"
                        children={txt.journalSearchInterface.buttons.browseAllJournals.title}
                        aria-label={txt.journalSearchInterface.buttons.browseAllJournals.aria}
                        onClick={onSearchAll}
                        fullWidth
                    />
                </Grid>
            )}
        </>
    );
};

CommonButtons.propTypes = {
    onSearchAll: PropTypes.func,
    browseAllJournals: PropTypes.bool,
};

export default React.memo(CommonButtons);
