import React from 'react';
import PropTypes from 'prop-types';
import {ConfirmDialogBox} from 'uqlibrary-react-toolbox';
import Async from 'modules/SharedComponents/Async';
const PublicationForm = () => (<Async load={import('modules/SharedComponents/PublicationForm/containers/PublicationForm')}/>);

// forms & custom components
import {locale, validation, routes} from 'config';

export default class NewRecord extends React.Component {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        rawSearchQuery: PropTypes.string,
        newRecordFileUploadingError: PropTypes.bool,
        author: PropTypes.object
    };

    static defaultProps = {
        rawSearchQuery: ''
    };

    constructor(props) {
        super(props);
    }

    _recordSaved = () => {
        // show record save successfully confirmation box
        this.confirmationBox.showConfirmation();
    };

    _restartWorkflow = () => {
        this.props.actions.clearNewRecord();
        this.props.history.push(routes.pathConfig.records.add.find);
    };

    _navigateToMyResearch = () => {
        this.props.actions.clearNewRecord();
        this.props.history.push(routes.pathConfig.records.mine);
    }

    render() {
        // wait for author to load before rendering
        if (!this.props.author) return (<span />);

        const txt = locale.pages.addRecord;
        const {rawSearchQuery} = this.props;

        // set initial value only if it's a title (not pubmed/DOI)
        const initialValues = {
            currentAuthor: [
                {
                    'nameAsPublished': this.props.author ? this.props.author.aut_display_name : '',
                    'authorId': this.props.author ? this.props.author.aut_id : ''
                }
            ],
            rek_title: (!validation.isValidDOIValue(rawSearchQuery) && !validation.isValidPubMedValue(rawSearchQuery)) ? rawSearchQuery : ''
        };

        // set confirmation message depending on file upload status
        const saveConfirmationLocale = {...txt.successWorkflowConfirmation};
        if (this.props.newRecordFileUploadingError) {
            saveConfirmationLocale.confirmationMessage = saveConfirmationLocale.fileFailConfirmationMessage;
        } else {
            saveConfirmationLocale.confirmationMessage = saveConfirmationLocale.successConfirmationMessage;
        }
        return (
            <div>
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={this._navigateToMyResearch}
                    onCancelAction={this._restartWorkflow}
                    locale={saveConfirmationLocale}
                />
                <PublicationForm
                    onFormSubmitSuccess={this._recordSaved}
                    onFormCancel={this._restartWorkflow}
                    initialValues={initialValues}
                />
            </div>
        );
    }
}
