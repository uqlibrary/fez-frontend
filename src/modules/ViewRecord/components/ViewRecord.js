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
import Grid from '@material-ui/core/Grid';
import { general } from 'config';

export default class ViewRecord extends PureComponent {
    static propTypes = {
        recordToView: PropTypes.object,
        loadingRecordToView: PropTypes.bool,
        recordToViewError: PropTypes.string,
        match: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
        hideCulturalSensitivityStatement: PropTypes.bool,
        account: PropTypes.object,
    };

    componentDidMount() {
        if (this.props.actions.loadRecordToView && !this.props.recordToView) {
            this.props.actions.loadRecordToView(this.props.match.params.pid);
        }
    }

    componentWillReceiveProps(newProps) {
        if (this.props.match.params.pid !== newProps.match.params.pid) {
            this.props.actions.loadRecordToView(newProps.match.params.pid);
        }
    }

    componentWillUnmount() {
        // clear previously selected record
        !!this.props.actions.clearRecordToView &&
        this.props.actions.clearRecordToView();
    }

    render() {
        const txt = locale.pages.viewRecord;
        const { loadingRecordToView, recordToViewError, recordToView } = this.props;
        const isNtro = recordToView && !!general.NTRO_SUBTYPES.includes(recordToView.rek_subtype);
        if(loadingRecordToView) {
            return <InlineLoader message={txt.loadingMessage}/>;
        } else if(recordToViewError) {
            return (
                <StandardPage>
                    <Alert message={recordToViewError} />
                </StandardPage>
            );
        } else if(!recordToView) {
            return <div className="empty"/>;
        }
        return (
            <StandardPage className="viewRecord" title={ReactHtmlParser(recordToView.rek_title)}>
                <Grid container style={{ marginTop: -24 }}>
                    <Grid item xs={12}>
                        <PublicationCitation publication={recordToView} hideTitle hideContentIndicators/>
                    </Grid>
                </Grid>
                <Grid container spacing={24}>
                    <Files
                        publication={recordToView}
                        hideCulturalSensitivityStatement={this.props.hideCulturalSensitivityStatement}
                        setHideCulturalSensitivityStatement={this.props.actions.setHideCulturalSensitivityStatement} />
                    <Links publication={recordToView}/>
                    <RelatedPublications publication={recordToView} />
                    <AdditionalInformation publication={recordToView} account={this.props.account} isNtro={isNtro} />
                    {
                        isNtro &&
                        <NtroDetails publication={recordToView} account={this.props.account}/>
                    }
                    <GrantInformation publication={recordToView} />
                    <PublicationDetails publication={recordToView} />
                    <AvailableVersions publication={recordToView} />
                </Grid>
            </StandardPage>
        );
    }
}
