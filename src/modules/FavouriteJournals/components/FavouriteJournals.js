import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import locale from 'locale/components';
import FavouriteJournalsList from './FavouriteJournalsList';
import { StandardCard } from '../../SharedComponents/Toolbox/StandardCard';
import { pathConfig } from '../../../config';
import { BackToSearchButton } from '../../SharedComponents/JournalsCommonButtons';
import { retrieveFavouriteJournals } from '../../../actions';

export const FavouriteJournals = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const txt = locale.components.favouriteJournals;

    React.useEffect(() => {
        dispatch(retrieveFavouriteJournals());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const response = useSelector(state => state.get?.('favouriteJournalsReducer').response);
    const loading = useSelector(state => state.get?.('favouriteJournalsReducer').loading);
    const error = useSelector(state => state.get?.('favouriteJournalsReducer').error);

    const handleReturnToSearchClick = () => history.push(pathConfig.journals.search);
    return (
        <StandardPage title={txt.title} id="journal-search-page" data-testid="journal-search-page">
            <Grid container spacing={3}>
                <Grid item xs>
                    <Grid container spacing={2}>
                        <Grid item xs sm md={12}>
                            <StandardCard noHeader>
                                <Grid container spacing={2}>
                                    <FavouriteJournalsList
                                        total={response?.total}
                                        journals={response?.data}
                                        loading={loading}
                                        error={error}
                                    />
                                </Grid>
                                <Grid style={{ paddingTop: 20 }} item xs={12}>
                                    <Grid container spacing={2} justify="flex-end">
                                        <Grid item xs="auto">
                                            <BackToSearchButton
                                                children={txt.buttons.returnToSearch.title}
                                                aria-label={txt.buttons.returnToSearch.aria}
                                                onClick={handleReturnToSearchClick}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </StandardPage>
    );
};

export default React.memo(FavouriteJournals);
