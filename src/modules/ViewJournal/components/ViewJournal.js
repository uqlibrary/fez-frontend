import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { JournalDetailsContext } from './JournalDataContext';
import Section from './Section';

import { locale } from 'locale';
import { viewJournalConfig } from 'config/viewJournal';
import * as actions from 'actions';

import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import Tooltip from '@material-ui/core/Tooltip';

const TitleAndFavourite = props => {
    const dispatch = useDispatch();
    const txt = locale.pages.journal.view;
    const { journal, setFavouriteUpdateError } = props;
    const [active, setActive] = React.useState(!!journal.jnl_favourite === true);

    const favouriteHandler = isAddingFavourite => {
        let newActive = isAddingFavourite;
        if (isAddingFavourite) {
            dispatch(actions.addToFavourites([journal.jnl_jid]))
                .catch(() => {
                    setFavouriteUpdateError(true);
                    newActive = false;
                })
                .then(() => {
                    active !== newActive && setActive(newActive);
                });
        } else {
            dispatch(actions.removeFromFavourites([journal.jnl_jid]))
                .catch(() => {
                    setFavouriteUpdateError(true);
                    newActive = true;
                })
                .then(() => {
                    active !== newActive && setActive(newActive);
                });
        }
    };

    return (
        <>
            {journal.jnl_title}
            <Tooltip title={active ? txt.favouriteTooltip.isFavourite : txt.favouriteTooltip.isNotFavourite}>
                <span>
                    <IconButton
                        id={`favourite-journal-${active ? 'saved' : 'notsaved'}`}
                        data-testid={`favourite-journal-${active ? 'saved' : 'notsaved'}`}
                        onClick={() => favouriteHandler(!active)}
                        size="small"
                    >
                        {active && <StarIcon color="primary" />}
                        {!active && <StarBorderIcon color="primary" />}
                    </IconButton>
                </span>
            </Tooltip>
        </>
    );
};

TitleAndFavourite.propTypes = {
    journal: PropTypes.object.isRequired,
    setFavouriteUpdateError: PropTypes.func.isRequired,
};

export const ViewJournal = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const txt = locale.pages.journal.view;

    const journalLoading = useSelector(state => state.get('journalReducer').journalLoading);
    const journalDetails = useSelector(state => state.get('journalReducer').journalDetails);
    const journalLoadingError = useSelector(state => state.get('journalReducer').journalLoadingError);

    const [favouriteUpdateError, setFavouriteUpdateError] = React.useState(false);
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
            title={<TitleAndFavourite journal={journalDetails} setFavouriteUpdateError={setFavouriteUpdateError} />}
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
                                dismissAction={() => setFavouriteUpdateError(false)}
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
