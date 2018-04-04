import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {InlineLoader} from 'uqlibrary-react-toolbox/build/Loaders';
import {StandardPage} from 'uqlibrary-react-toolbox/build/StandardPage';
import {Alert} from 'uqlibrary-react-toolbox/build/Alert';
import {PublicationCitation} from 'modules/SharedComponents/PublicationCitation';
import {locale} from 'locale';
import Files from './Files';
import PublicationDetails from './PublicationDetails';
import AdditionalInformation from './AdditionalInformation';
import GrantInformation from './GrantInformation';
import MediaPreview from './MediaPreview';
import Links from './Links';
import {OPEN_ACCESS_ID_LINK_NO_DOI} from 'config/general';

export default class ViewRecord extends Component {
    static propTypes = {
        recordToView: PropTypes.object,
        loadingRecordToView: PropTypes.bool,
        recordToViewError: PropTypes.string,
        match: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
        hideCulturalSensitivityStatement: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.state = {
            preview: {
                mediaUrl: null,
                previewMediaUrl: null,
                mimeType: null
            }
        };
    }

    componentDidMount() {
        if (this.props.actions && !this.props.recordToView) {
            this.props.actions.loadRecordToView(this.props.match.params.pid);
        }
    }

    componentWillUnmount() {
        // clear previously selected record
        if (this.props.actions) {
            this.props.actions.clearRecordToView();
        }
    }

    handleFileNameClick = (mediaUrl, previewMediaUrl, mimeType) => (ev) => {
        ev.preventDefault();
        this.setState({
            preview: {
                mediaUrl: mediaUrl,
                previewMediaUrl: previewMediaUrl,
                mimeType: mimeType
            }
        });
    }

    resetPreviewState = () => {
        this.setState({
            preview: {
                mediaUrl: null,
                previewMediaUrl: null,
                mimeType: null
            }
        });
    }

    render() {
        const txt = locale.pages.viewRecord;
        const {loadingRecordToView, recordToViewError, recordToView} = this.props;

        if(loadingRecordToView) {
            return (
                <div className="is-centered">
                    <InlineLoader message={txt.loadingMessage}/>
                </div>
            );
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
            <StandardPage className="viewRecord" title={recordToView.rek_title}>
                <PublicationCitation publication={recordToView} hideTitle />
                {
                    recordToView.fez_record_search_key_file_attachment_name && recordToView.fez_record_search_key_file_attachment_name.length > 0
                    && !this.props.hideCulturalSensitivityStatement &&
                    <Alert message={locale.viewRecord.sections.files.culturalSensitivityStatement} type={'info'} allowDismiss dismissAction={this.props.actions.hideCulturalSensitivityStatement} />
                }
                {
                    recordToView.fez_record_search_key_file_attachment_name && recordToView.fez_record_search_key_file_attachment_name.length > 0 &&
                    <Files publication={recordToView} onFileSelect={this.handleFileNameClick}/>
                }
                {
                    this.state.preview.mediaUrl && this.state.preview.mimeType &&
                    <MediaPreview mediaUrl={this.state.preview.mediaUrl} previewMediaUrl={this.state.preview.previewMediaUrl} mimeType={this.state.preview.mimeType} onClose={this.resetPreviewState}/>
                }
                {
                    recordToView.rek_display_type_lookup &&
                    (recordToView.fez_record_search_key_link && recordToView.fez_record_search_key_link.length > 0
                    || recordToView.fez_record_search_key_pubmed_central_id && recordToView.fez_record_search_key_pubmed_central_id.rek_pubmed_central_id
                    || recordToView.fez_record_search_key_doi && recordToView.fez_record_search_key_doi.rek_doi
                    || recordToView.fez_record_search_key_oa_status && recordToView.fez_record_search_key_oa_status.rek_oa_status === OPEN_ACCESS_ID_LINK_NO_DOI) &&
                    <Links publication={recordToView}/>
                }
                {
                    recordToView.rek_display_type_lookup &&
                    <AdditionalInformation publication={recordToView} />
                }
                {
                    recordToView.fez_record_search_key_grant_agency && recordToView.fez_record_search_key_grant_agency.length > 0 &&
                    <GrantInformation publication={recordToView} />
                }
                {
                    recordToView.rek_display_type_lookup &&
                    <PublicationDetails publication={recordToView} />
                }

            </StandardPage>
        );
    }
}
