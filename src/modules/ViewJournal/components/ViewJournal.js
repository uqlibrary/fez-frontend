import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Grid from '@mui/material/GridLegacy';
import Box from '@mui/material/Box';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import WorkNotFound from 'modules/NotFound/components/WorkNotFound';

import * as actions from 'actions';

import { JournalContext } from 'context';
import Section from './Section';
import { parseHtmlToJSX } from 'helpers/general';

import { userIsAdmin } from 'hooks';
import { default as globalLocale } from 'locale/global';
import { default as pagesLocale } from 'locale/pages';
import { default as viewJournalLocale } from 'locale/viewJournal';
import { viewJournalConfig } from 'config/viewJournal';

import TitleWithFavouriteButton from './partials/TitleWithFavouriteButton';

export const getAdvisoryStatement = html => {
    return !!html ? parseHtmlToJSX(html) : '';
};

export const ViewJournal = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const isAdmin = userIsAdmin();
    const txt = pagesLocale.pages.journal.view;
    const viewJournalTxt = viewJournalLocale.viewJournal;

    const journalLoading = useSelector(state => state.get('viewJournalReducer').loadingJournalToView);
    const journalDetails = useSelector(state => state.get('viewJournalReducer').journalToView);
    const journalLoadingError = useSelector(state => state.get('viewJournalReducer').journalToViewError);
    const [favouriteUpdateError, setUpdateFavouriteError] = React.useState(false);
    const alertProps = favouriteUpdateError && {
        ...txt.errorAlert,
        message: txt.errorAlert.message(globalLocale.global.errorMessages.generic),
    };

    const journalDetailsLength = (!!journalDetails && Object.keys(journalDetails)?.length) || 0;

    React.useEffect(() => {
        !!id && journalDetailsLength === 0 && dispatch(actions.loadJournal(id));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, journalDetailsLength]);

    if (journalLoading) {
        return <InlineLoader message={txt.loadingMessage} loaderId="journal-loading" />;
    }

    if (journalLoadingError) {
        if (journalLoadingError.status === 404) {
            return (
                <WorkNotFound
                    title={viewJournalTxt.notFound.title}
                    message={viewJournalTxt.notFound.message}
                    loadingError={journalLoadingError}
                />
            );
        } else {
            return (
                <StandardPage>
                    <Alert {...txt.loadFailureAlert} />
                </StandardPage>
            );
        }
    }

    if (journalDetailsLength === 0) {
        return <StandardPage />;
    }

    const capped = journalDetails.fez_journal_read_and_publish?.jnl_read_and_publish_is_capped.toLowerCase();

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
                    showAdminActions={isAdmin}
                    sx={{ display: 'flex' }}
                />
            }
        >
            <JournalContext.Provider
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
                    {Object.keys(journalDetails).length > 0 && journalDetails.jnl_advisory_statement && (
                        <Grid item xs={12}>
                            <Alert
                                type={
                                    journalDetails?.jnl_advisory_statement_type_lookup?.trim?.().toLowerCase() || 'info'
                                }
                                title={txt.advisoryStatement.title}
                                message={
                                    <Box sx={{ wordWrap: { xs: 'break-word', sm: 'normal' } }}>
                                        {getAdvisoryStatement(journalDetails.jnl_advisory_statement)}
                                    </Box>
                                }
                            />
                        </Grid>
                    )}
                    {(capped === 'approaching' || capped === 'exceeded') && (
                        <Grid item xs={12}>
                            <Alert
                                type={'warning'}
                                title={viewJournalTxt.readAndPublish.alert.title}
                                message={
                                    <Box sx={{ wordWrap: { xs: 'break-word', sm: 'normal' } }}>
                                        {(capped === 'approaching' &&
                                            viewJournalTxt.readAndPublish.alert.approaching) ||
                                            (capped === 'exceeded' && viewJournalTxt.readAndPublish.alert.exceeded)}
                                    </Box>
                                }
                            />
                        </Grid>
                    )}
                    {capped === 'nodeal' && (
                        <Grid item xs={12}>
                            <Alert
                                type={'info'}
                                title={viewJournalTxt.readAndPublish.alert.title}
                                message={
                                    <Box sx={{ wordWrap: { xs: 'break-word', sm: 'normal' } }}>
                                        {viewJournalTxt.readAndPublish.alert.nodeal}
                                    </Box>
                                }
                            />
                        </Grid>
                    )}
                    {Object.entries(viewJournalConfig)
                        // eslint-disable-next-line no-unused-vars
                        .filter(([_, sectionConfig]) => {
                            if (!!sectionConfig.key) {
                                return Array.isArray(sectionConfig.key)
                                    ? sectionConfig.key.some(key =>
                                          Array.isArray(journalDetails[key])
                                              ? journalDetails[key].length > 0
                                              : !!journalDetails[key],
                                      )
                                    : /* istanbul ignore next */ !!journalDetails[sectionConfig.key];
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
            </JournalContext.Provider>
        </StandardPage>
    );
};

ViewJournal.propTypes = {};

export default React.memo(ViewJournal);
