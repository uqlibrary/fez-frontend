import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import locale from '../../../../locale/components';
import { pathConfig } from '../../../../config';
import { useHistory } from 'react-router';

const CommonButtons = () => {
    const history = useHistory();
    const txt = locale.components.journalSearch;
    const handleFavouriteJournalsClick = () =>
        history.push({
            pathname: pathConfig.journals.favourites,
            state: { fromSearch: true },
        });
    return (
        <>
            <Grid item xs={12} sm="auto">
                <Button
                    children={txt.journalSearchInterface.buttons.myFavouriteJournals.title}
                    aria-label={txt.journalSearchInterface.buttons.myFavouriteJournals.aria}
                    onClick={handleFavouriteJournalsClick}
                    id="journal-search-favourite-journals-button"
                    data-testid="journal-search-favourite-journals-button"
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm="auto">
                <Button
                    id="journal-search-browse-all-button"
                    data-testid="journal-search-browse-all-button"
                    children={txt.journalSearchInterface.buttons.browseAllJournals.title}
                    aria-label={txt.journalSearchInterface.buttons.browseAllJournals.aria}
                    fullWidth
                />
            </Grid>
        </>
    );
};

export default React.memo(CommonButtons);
