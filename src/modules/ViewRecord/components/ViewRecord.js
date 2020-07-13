import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { PublicationCitation } from 'modules/SharedComponents/PublicationCitation';
import locale from 'locale/pages';
import Files from './Files';
import PublicationDetails from './PublicationDetails';
import AdditionalInformation from './AdditionalInformation';
import GrantInformation from './GrantInformation';
import RelatedPublications from './RelatedPublications';
import Links from './Links';
import NtroDetails from './NtroDetails';
import AvailableVersions from './AvailableVersions';
import ReactHtmlParser from 'react-html-parser';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import { general } from 'config';
import { SocialShare } from 'modules/SharedComponents/SocialShare';
import Typography from '@material-ui/core/Typography';

export default class ViewRecord extends PureComponent {
    static propTypes = {
        recordToView: PropTypes.object,
        loadingRecordToView: PropTypes.bool,
        recordToViewError: PropTypes.object,
        match: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
        hideCulturalSensitivityStatement: PropTypes.bool,
        account: PropTypes.object,
        author: PropTypes.object,
        authorDetails: PropTypes.object,
        isDeleted: PropTypes.bool,
        history: PropTypes.any,
    };

    componentDidMount() {
        if (this.props.actions.loadRecordToView && !this.props.recordToView) {
            this.props.actions.loadRecordToView(this.props.match.params.pid);
        }
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(newProps) {
        if (this.props.match.params.pid !== newProps.match.params.pid) {
            this.props.actions.loadRecordToView(newProps.match.params.pid);
        }
    }

    componentWillUnmount() {
        // clear previously selected record
        !!this.props.actions.clearRecordToView && this.props.actions.clearRecordToView();
    }

    render() {
        const txt = locale.pages.viewRecord;
        const { loadingRecordToView, recordToViewError, recordToView, isDeleted } = this.props;
        const isNtro = recordToView && !!general.NTRO_SUBTYPES.includes(recordToView.rek_subtype);
        if (isDeleted) {
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
        }
        if (loadingRecordToView) {
            return <InlineLoader message={txt.loadingMessage} />;
        } else if (recordToViewError) {
            return (
                <StandardPage>
                    <Alert message={recordToViewError} />
                </StandardPage>
            );
        } else if (!recordToView || !recordToView.rek_pid) {
            return <div className="empty" />;
        }
        const isAuthor =
            this.props.author &&
            recordToView.fez_record_search_key_author_id &&
            !!recordToView.fez_record_search_key_author_id.some(authors => {
                return parseInt(authors.rek_author_id, 10) === parseInt(this.props.author.aut_id, 10);
            });
        const isAdmin =
            this.props.authorDetails &&
            (this.props.authorDetails.is_administrator === 1 || this.props.authorDetails.is_super_administrator === 1);
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
                        />
                    </Grid>
                    {!isDeleted && !!this.props.recordToView && (
                        <Grid item xs={12}>
                            <Grid container spacing={2} style={{ marginBottom: 4 }}>
                                <Grid item xs>
                                    {isAdmin && recordToView.rek_status !== general.PUBLISHED && (
                                        <Chip label={recordToView.rek_status_lookup} variant="outlined" />
                                    )}
                                </Grid>
                                <Grid item>
                                    <SocialShare
                                        publication={this.props.recordToView}
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
                <Grid container spacing={3}>
                    {!isDeleted && (
                        <React.Fragment>
                            <Files
                                author={this.props.author}
                                publication={recordToView}
                                hideCulturalSensitivityStatement={this.props.hideCulturalSensitivityStatement}
                                setHideCulturalSensitivityStatement={
                                    this.props.actions.setHideCulturalSensitivityStatement
                                }
                                isAdmin={!!isAdmin}
                                isAuthor={!!isAuthor}
                            />
                            <Links publication={recordToView} />
                            <RelatedPublications publication={recordToView} />
                            <AdditionalInformation
                                publication={recordToView}
                                account={this.props.account}
                                isNtro={isNtro}
                            />
                            {isNtro && <NtroDetails publication={recordToView} account={this.props.account} />}
                            <GrantInformation publication={recordToView} />
                        </React.Fragment>
                    )}
                    <PublicationDetails publication={recordToView} />
                    {!isDeleted && <AvailableVersions publication={recordToView} />}
                </Grid>
            </StandardPage>
        );
    }
}
