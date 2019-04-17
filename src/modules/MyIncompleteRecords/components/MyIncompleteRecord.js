import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Field, propTypes} from 'redux-form/immutable';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {TextField} from 'modules/SharedComponents/Toolbox/TextField';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {Alert} from 'modules/SharedComponents/Toolbox/Alert';
import {FileUploadField} from 'modules/SharedComponents/Toolbox/FileUploader';
import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';
import {PublicationCitation} from 'modules/SharedComponents/PublicationCitation';
import {default as pagesLocale} from 'locale/pages';
import {validation} from 'config';
import JSONPretty from 'react-json-pretty';
import {GrantListEditorField} from 'modules/SharedComponents/GrantListEditor';

export default class MyIncompleteRecord extends PureComponent {
    static propTypes = {
        ...propTypes, // all redux-form props
        disableSubmit: PropTypes.bool,

        recordToFix: PropTypes.object,
        loadingRecordToFix: PropTypes.bool,

        author: PropTypes.object,
        accountAuthorLoading: PropTypes.bool,

        history: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,

        publicationToFixFileUploadingError: PropTypes.bool,

        errors: PropTypes.object,
        initialValues: PropTypes.object
    };

    componentDidMount() {
        if (this.props.actions && !this.props.recordToFix &&
            this.props.match.params && this.props.match.params.pid) {
            this.props.actions.loadRecordToFix(this.props.match.params.pid);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitSucceeded !== this.props.submitSucceeded) {
            this.successConfirmationBox.showConfirmation();
        }
    }

    componentWillUnmount() {
        // clear previously selected recordToFix for a fix
        this.props.actions.clearFixRecord();
    }

    // TODO: Uncomment this before going live
    // isLoggedInUserLinked = (author, recordToFix, searchKey, subkey) => {
    //     return !!author && !!recordToFix && recordToFix[searchKey] && recordToFix[searchKey].length > 0
    //         && recordToFix[searchKey].filter(authorId => authorId[subkey] === author.aut_id).length > 0;
    // };

    // TODO: Uncomment this before going live
    // isAuthorLinked = () => {
    //     const isAuthorLinked = this.isLoggedInUserLinked(this.props.author, this.props.recordToFix, 'fez_record_search_key_author_id', 'rek_author_id');
    //     const isContributorLinked = this.isLoggedInUserLinked(this.props.author, this.props.recordToFix, 'fez_record_search_key_contributor_id', 'rek_contributor_id');
    //
    //     return isAuthorLinked || isContributorLinked;
    // };

    _cancelFix = () => {
        this.props.history.goBack();
    };

    _actionSelected = (event, value) => {
        this.setState({
            selectedRecordAction: value
        });
    };

    _setSuccessConfirmation = (ref) => {
        this.successConfirmationBox = ref;
    };

    _handleDefaultSubmit = (event) => {
        if(event) event.preventDefault();
    };

    render() {
        // console.log(this.props.initialValues.toJS());
        // if author is not linked to this record, abandon form
        // TODO: Uncomment this before going live
        // if (!(this.props.accountAuthorLoading || this.props.loadingRecordToFix) && !this.isAuthorLinked()) {
        //     this.props.history.go(-1);
        //     return <div />;
        // }

        const txt = pagesLocale.pages.incompletePublication;

        if(this.props.accountAuthorLoading || this.props.loadingRecordToFix) {
            return (
                <React.Fragment>
                    <InlineLoader message={txt.loadingMessage}/>
                </React.Fragment>
            );
        }

        // set confirmation message depending on file upload status
        const saveConfirmationLocale = {...txt.successWorkflowConfirmation};
        saveConfirmationLocale.confirmationMessage = (
            <React.Fragment>
                {this.props.publicationToFixFileUploadingError && <Alert {...saveConfirmationLocale.fileFailConfirmationAlert} />}
                {saveConfirmationLocale.confirmationMessage}
            </React.Fragment>
        );
        return (
            <StandardPage title={this.props.recordToFix && this.props.recordToFix.rek_title || ''}>
                <PublicationCitation publication={this.props.recordToFix} hideTitle/>
                <form onSubmit={this._handleDefaultSubmit}>
                    <Grid container spacing={24}>
                        <Grid item xs={12}>
                            <StandardCard title={'Test of initialValues from a PID'}>
                                <Field
                                    component={TextField}
                                    name="rek_title"
                                    fullWidth
                                    label={'Title'}
                                    required
                                    validate={[validation.required]}
                                />
                            </StandardCard>
                        </Grid>
                        <Grid item xs={12}>
                            <StandardCard title={'JSON of the initialValues'}>
                                <JSONPretty id="json-pretty" data={this.props.initialValues} />
                            </StandardCard>
                        </Grid>
                        <Grid item xs={12}>
                            <StandardCard title="Grant information">
                                <Field
                                    component={GrantListEditorField}
                                    name="grants"
                                    disabled={this.props.submitting}
                                />
                            </StandardCard>
                        </Grid>
                        <Grid item xs={12}>
                            <StandardCard title={txt.fileUpload.title} help={txt.fileUpload.help}>
                                <Field
                                    name="files"
                                    component={ FileUploadField }
                                    disabled={this.props.submitting}
                                    requireOpenAccessStatus
                                    validate={[validation.validFileUpload]}
                                    isNtro
                                />
                            </StandardCard>
                        </Grid>
                    </Grid>
                    <Grid container spacing={24}>
                        <Grid item xs />
                        <Grid item>
                            <Button
                                variant={'contained'}
                                fullWidth
                                children={'CANCEL'}
                                disabled={this.props.submitting}
                                onClick={this._cancelFix}/>
                        </Grid>
                        <Grid item>
                            <Button
                                variant={'contained'}
                                color={'primary'}
                                fullWidth
                                children={'COMPLETE MY RECORD'}
                                onClick={this.props.handleSubmit}
                                disabled={this.props.submitting || this.props.disableSubmit}/>
                        </Grid>
                    </Grid>
                </form>
            </StandardPage>
        );
    }
}
