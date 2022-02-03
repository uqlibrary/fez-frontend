import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { PublicationCitation } from 'modules/SharedComponents/PublicationCitation';
import { SocialShare } from 'modules/SharedComponents/SocialShare';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import AdditionalInformation from './AdditionalInformation';
import AvailableVersions from './AvailableVersions';
import Files from './Files';
import GrantInformation from './GrantInformation';
import Links from './Links';
import NtroDetails from './NtroDetails';
import PublicationDetails from './PublicationDetails';
import RelatedPublications from './RelatedPublications';

import { userIsAdmin, userIsAuthor } from 'hooks';
import { AUTH_URL_LOGIN, general } from 'config';
import locale from 'locale/pages';
import globalLocale from 'locale/global';
import * as actions from 'actions';
import { notFound } from '../../../config/routes';

export function redirectUserToLogin() {
    window.location.assign(`${AUTH_URL_LOGIN}?url=${window.btoa(window.location.href)}`);
}

export const NewViewRecord = ({
    account,
    author,
    hideCulturalSensitivityStatement,
    isDeleted,
    loadingRecordToView,
    recordToViewError,
    recordToView,
}) => {
    const dispatch = useDispatch();
    const { pid, version } = useParams();
    const isNotFoundRoute = !!pid && pid === notFound;
    const isAdmin = userIsAdmin();
    const isAuthor = userIsAuthor();

    const txt = locale.pages.viewRecord;
    const isNtro = recordToView && !!general.NTRO_SUBTYPES.includes(recordToView.rek_subtype);

    const handleSetHideCulturalSensitivityStatement = React.useCallback(
        () => dispatch(actions.setHideCulturalSensitivityStatement()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    React.useEffect(() => {
        !!pid &&
            !isNotFoundRoute &&
            dispatch(version ? actions.loadRecordVersionToView(pid, version) : actions.loadRecordToView(pid));

        return () => dispatch(actions.clearRecordToView());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isNotFoundRoute, pid, version]);

    if (!isNotFoundRoute && loadingRecordToView) {
        return <InlineLoader message={txt.loadingMessage} />;
    } else if (isNotFoundRoute || (recordToViewError && recordToViewError.status === 404)) {
        return (
            <StandardPage className="viewRecord" title={locale.pages.viewRecord.notFound.title}>
                <Grid container style={{ marginTop: -24 }}>
                    <Grid item xs={12}>
                        {locale.pages.viewRecord.notFound.message}
                    </Grid>
                </Grid>
                {recordToViewError && (
                    <Typography variant={'caption'} style={{ opacity: 0.5 }}>
                        {`(${recordToViewError.status} - ${recordToViewError.message})`}
                    </Typography>
                )}
            </StandardPage>
        );
    } else if (!isNotFoundRoute && recordToViewError && recordToViewError.status === 403) {
        return (
            <StandardPage>
                <Alert {...globalLocale.global.loginAlert} action={redirectUserToLogin} />
            </StandardPage>
        );
    } else if (!isNotFoundRoute && (!recordToView || !recordToView.rek_pid)) {
        return <div className="empty" />;
    }

    return (
        <StandardPage className="viewRecord" title={ReactHtmlParser(recordToView.rek_title)}>
            <Grid container style={{ marginTop: -24 }}>
                <Grid item xs={12}>
                    <PublicationCitation
                        publication={recordToView}
                        hideTitle
                        hideContentIndicators
                        showAdminActions={isAdmin}
                        isPublicationDeleted={isDeleted}
                        citationStyle={'header'}
                    />
                </Grid>
                {!isDeleted && !!recordToView && (
                    <Grid item xs={12}>
                        <Grid container spacing={2} style={{ marginBottom: 4 }}>
                            <Grid item xs>
                                {isAdmin && recordToView.rek_status !== general.PUBLISHED && (
                                    <Chip label={recordToView.rek_status_lookup} variant="outlined" />
                                )}
                            </Grid>
                            <Grid item>
                                <SocialShare
                                    publication={recordToView}
                                    services={[
                                        'facebook',
                                        'twitter',
                                        'linkedin',
                                        'researchgate',
                                        'mendeley',
                                        'email',
                                        'print',
                                    ]}
                                    spaceBetween={4}
                                    round
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </Grid>
            {isDeleted && (
                <Grid item xs={12} style={{ marginBottom: 24 }}>
                    <Alert {...txt.deletedAlert} />
                </Grid>
            )}
            {/* eslint-disable-next-line camelcase */}
            {!!version && !!recordToView?.rek_version && (
                <Grid item xs={12} style={{ marginBottom: 24 }}>
                    <Alert
                        {...{
                            ...txt.version.alert.version,
                            message: txt.version.alert.version.message(recordToView),
                        }}
                    />
                    <br />
                    <Alert {...txt.version.alert.warning} />
                </Grid>
            )}
            <Grid container spacing={3}>
                {!isDeleted && (
                    <React.Fragment>
                        <Files
                            author={author}
                            account={account}
                            publication={recordToView}
                            hideCulturalSensitivityStatement={hideCulturalSensitivityStatement}
                            setHideCulturalSensitivityStatement={handleSetHideCulturalSensitivityStatement}
                            isAdmin={!!isAdmin}
                            isAuthor={!!isAuthor}
                        />
                        <Links publication={recordToView} />
                        <RelatedPublications publication={recordToView} />
                        <AdditionalInformation publication={recordToView} account={account} isNtro={isNtro} />
                        {isNtro && <NtroDetails publication={recordToView} account={account} />}
                        <GrantInformation publication={recordToView} />
                    </React.Fragment>
                )}
                <PublicationDetails publication={recordToView} />
                {!isDeleted && <AvailableVersions publication={recordToView} />}
            </Grid>
        </StandardPage>
    );
};

NewViewRecord.propTypes = {
    account: PropTypes.object,
    author: PropTypes.object,
    hideCulturalSensitivityStatement: PropTypes.bool,
    isDeleted: PropTypes.bool,
    loadingRecordToView: PropTypes.bool,
    recordToView: PropTypes.object,
    recordToViewError: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default React.memo(
    NewViewRecord,
    (prevProps, nextProps) => prevProps.loadingRecordToView === nextProps.loadingRecordToView,
);
