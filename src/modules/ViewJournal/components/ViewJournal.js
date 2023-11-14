import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import Grid from '@mui/material/Grid';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import * as actions from 'actions';

import { JournalDetailsContext } from './JournalDataContext';
import Section from './Section';

import { locale } from 'locale';
import { viewJournalConfig } from 'config/viewJournal';

import TitleWithFavouriteButton from './partials/TitleWithFavouriteButton';

export const ViewJournal = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const txt = locale.pages.journal.view;

    const journalLoading = useSelector(state => state.get('journalReducer').journalLoading);
    const journalDetails = useSelector(state => state.get('journalReducer').journalDetails);
    const journalLoadingError = useSelector(state => state.get('journalReducer').journalLoadingError);

    const [favouriteUpdateError, setUpdateFavouriteError] = React.useState(false);
    const alertProps = favouriteUpdateError && {
        ...txt.errorAlert,
        message: txt.errorAlert.message(locale.global.errorMessages.generic),
    };

    React.useEffect(() => {
        !!id && !journalDetails && dispatch(actions.loadJournal(id));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (journalLoading) {
        return <InlineLoader message={txt.loadingMessage} loaderId="journal-loading" />;
    }

    if (journalLoadingError) {
        return (
            <StandardPage>
                <Alert {...txt.loadFailureAlert} />
            </StandardPage>
        );
    }

    if (!journalDetails) {
        return <StandardPage />;
    }

    return (
        <StandardPage
            standarPageId="journal-view"
            title={
                <TitleWithFavouriteButton
                    journal={journalDetails}
                    actions={{ addFavourite: actions.addToFavourites, removeFavourite: actions.removeFromFavourites }}
                    handlers={{ errorUpdatingFavourite: setUpdateFavouriteError }}
                    tooltips={{
                        favourite: txt.favouriteTooltip.isFavourite,
                        notFavourite: txt.favouriteTooltip.isNotFavourite,
                    }}
                />
            }
        >
            <JournalDetailsContext.Provider
                value={{
                    journalDetails,
                }}
            >
                <Grid container spacing={3}>
                    {favouriteUpdateError && (
                        <Grid item xs={12}>
                            <Alert
                                pushToTop
                                {...alertProps}
                                allowDismiss
                                dismissAction={() => setUpdateFavouriteError(false)}
                            />
                        </Grid>
                    )}
                    {journalDetails && journalDetails.jnl_advisory_statement && (
                        <Grid item xs={12}>
                            <Alert
                                type={'info'}
                                title={txt.advisoryStatement.title}
                                message={journalDetails.jnl_advisory_statement}
                            />
                        </Grid>
                    )}
                    {Object.entries(viewJournalConfig)
                        // eslint-disable-next-line no-unused-vars
                        .filter(([_, sectionConfig]) => {
                            if (!!sectionConfig.key) {
                                return !!journalDetails[sectionConfig.key];
                            }
                            return true;
                        })
                        .map(([sectionKey, sectionConfig]) => (
                            <Section
                                key={`section-${sectionKey}`}
                                sectionKey={sectionKey}
                                sectionConfig={sectionConfig}
                            />
                        ))}
                </Grid>
            </JournalDetailsContext.Provider>
        </StandardPage>
    );
};

ViewJournal.propTypes = {};

export default React.memo(ViewJournal);
