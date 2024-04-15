import React, { useEffect, useCallback, useState } from 'react';
import { createHash } from 'crypto';
import { parse } from 'querystring';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import locale from 'locale/pages';
import { ORCID_AUTHORIZATION_URL, ORCID_CLIENT_ID, pathConfig } from 'config';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { linkAuthorOrcidId, showAppAlert, resetSavingAuthorState, dismissAppAlert } from 'actions';

const Orcid = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { author, account, accountAuthorLoading, accountAuthorSaving, accountAuthorError } = useSelector(state =>
        state.get('accountReducer'),
    );

    // states
    const [orcidRequest, setOrcidRequest] = useState({
        client_id: ORCID_CLIENT_ID,
        response_type: 'code',
        scope: '/read-limited /activities/update /person/update',
        redirect_uri: pathConfig.authorIdentifiers.orcid.absoluteLink,
        state: null,
    });

    const [existingOrcidRequest, setExistingOrcidRequest] = useState({
        show_login: false,
        family_names: '',
        given_names: '',
    });

    const [orcidResponse, setOrcidResponse] = useState({
        code: null,
        state: null,
    });

    const [authoriseConfirmationBox, setAuthoriseConfirmationBox] = useState(null);

    const _navigateToDashboard = useCallback(() => {
        navigate(pathConfig.dashboard);
    }, [navigate]);

    const createOrcidStateId = account => {
        return createHash('md5')
            .update(`${account.id}/${account.mail}/${new Date().setHours(0, 0, 0, 0)}`)
            .digest('hex');
    };

    const isOrcidStateValid = (account, sessionId, receivedSessionId) =>
        !account || !receivedSessionId || receivedSessionId === sessionId;

    useEffect(() => {
        return () => dispatch(resetSavingAuthorState());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // author's orcid id has been updated successfully
        // eslint-disable-next-line camelcase
        if (orcidResponse.code && orcidResponse.state && author?.aut_orcid_id) {
            dispatch(
                showAppAlert({
                    ...locale.pages.orcidLink.successAlert,
                    dismissAction: /* istanbul ignore next */ () => dispatch(dismissAppAlert()),
                }),
            );
        }

        // eslint-disable-next-line camelcase
        if (!accountAuthorLoading && (!author?.aut_id || author.aut_orcid_id)) {
            _navigateToDashboard();
            return;
        }

        // when ORCID registration went through, and ORCID has redirected back to eSpace
        // check status of ORCID redirect, if it's still in the same session (state)
        // in prod/staging
        // http://espace/path/to/page/?code=bOQpKB&state=5ea13ef0dad88453242fcc8f65a0f90a
        // or in dev environment
        // http://development/espace/branch/?code=bOQpKB&state=5ea13ef0dad88453242fcc8f65a0f90a#path/to/page/
        const queryString =
            location.hash.indexOf('?') >= 0
                ? location.hash.substr(location.hash.indexOf('?') + 1)
                : location.search.substr(1);

        let queryParams;
        try {
            queryParams = parse(queryString);
        } catch (e) {
            /* istanbul ignore next */
            queryParams = {
                code: null,
                state: null,
            };
        }

        setExistingOrcidRequest({
            show_login: false,
            family_names: account ? account.lastName : '',
            given_names: account ? account.firstName : '',
        });

        if (queryParams.code && queryParams.state) {
            setOrcidResponse({
                code: queryParams.code,
                state: queryParams.state,
            });
        }

        // link author to orcid when orcid authorisation response is received from orcid website
        // (url contains required parameters)
        if (
            account &&
            // eslint-disable-next-line camelcase
            !author?.aut_orcid_id &&
            orcidRequest.state &&
            orcidResponse.code &&
            orcidResponse.state &&
            isOrcidStateValid(account, orcidRequest.state, orcidResponse.state)
        ) {
            dispatch(linkAuthorOrcidId(account.id, author.aut_id, orcidResponse.code));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        accountAuthorLoading,
        author,
        account,
        location.hash,
        location.search,
        orcidRequest.state,
        orcidResponse.code,
        orcidResponse.state,
    ]);

    const _setAuthoriseConfirmation = ref => {
        setAuthoriseConfirmationBox(ref);
    };

    const getOrcidUrl = isNew => {
        const orcidStateId = createOrcidStateId(account);
        setOrcidRequest({ ...orcidRequest, state: orcidStateId });

        const params = {
            ...orcidRequest,
            state: orcidStateId,
            ...(isNew ? { show_login: true } : existingOrcidRequest),
        };
        const stringifiedParams = Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
        return `${ORCID_AUTHORIZATION_URL}?${stringifiedParams}`;
    };

    const _showAuthoriseConfirmation = (/* istanbul ignore next */ isNew = true) => {
        const url = getOrcidUrl(isNew);
        authoriseConfirmationBox._onAction = () => window.location.assign(url);
        authoriseConfirmationBox.showConfirmation();
    };

    const getAlert = ({ submitFailed, submitting = false, error, alertLocale }) => {
        let alertProps = null;
        if (submitFailed && error) {
            alertProps = {
                ...alertLocale.errorAlert,
                message: alertLocale.errorAlert.message(error),
            };
        } else if (submitting) {
            alertProps = { ...alertLocale.progressAlert };
        }
        return alertProps ? <Alert {...alertProps} /> : null;
    };

    // wait for author and account to be loaded
    // eslint-disable-next-line camelcase
    if (!author?.aut_id || !account) {
        return <div />;
    }

    const txt = locale.pages.orcidLink;
    const isValidOrcidState = isOrcidStateValid(account, orcidRequest.state, orcidResponse.state);

    return (
        <StandardPage title={txt.title}>
            <ConfirmDialogBox onRef={_setAuthoriseConfirmation} locale={txt.grantAccessConfirmation} />
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {getAlert({
                        submitFailed: !!accountAuthorError || !isValidOrcidState,
                        error: !isValidOrcidState
                            ? locale.pages.orcidLink.errorAlert.orcidStateError
                            : accountAuthorError,
                        submitting: accountAuthorSaving,
                        alertLocale: txt,
                    })}
                </Grid>
                <Grid item xs={12}>
                    <StandardCard title={txt.linkOrcid.title}>
                        <Typography component={'span'} gutterBottom>
                            {txt.linkOrcid.description}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs sx={{ display: { xs: 'none', sm: 'block' } }} />

                            <Grid item xs={12} sm={'auto'}>
                                <Button
                                    aria-label={txt.linkOrcid.labels.submit}
                                    variant={'contained'}
                                    color={'primary'}
                                    fullWidth
                                    disabled={accountAuthorSaving}
                                    children={txt.linkOrcid.labels.submit}
                                    onClick={() => _showAuthoriseConfirmation()}
                                />
                            </Grid>
                        </Grid>
                    </StandardCard>
                </Grid>
                <Grid item xs={12}>
                    <StandardCard title={txt.createOrcid.title}>
                        <Typography component={'span'} gutterBottom>
                            {txt.createOrcid.description}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs sx={{ display: { xs: 'none', sm: 'block' } }} />

                            <Grid item xs={12} sm={'auto'}>
                                <Button
                                    aria-label={txt.createOrcid.labels.submit}
                                    variant={'contained'}
                                    color={'primary'}
                                    fullWidth
                                    disabled={accountAuthorSaving}
                                    children={txt.createOrcid.labels.submit}
                                    onClick={() => _showAuthoriseConfirmation(false)}
                                />
                            </Grid>
                        </Grid>
                    </StandardCard>
                </Grid>
            </Grid>
        </StandardPage>
    );
};

export default Orcid;
