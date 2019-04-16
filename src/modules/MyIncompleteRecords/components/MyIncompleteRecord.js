import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';
// import {Field} from 'redux-form/immutable';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
// import {TextField} from 'modules/SharedComponents/Toolbox/TextField';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {Alert} from 'modules/SharedComponents/Toolbox/Alert';
import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';
import {PublicationCitation} from 'modules/SharedComponents/PublicationCitation';
import {default as pagesLocale} from 'locale/pages';
// import {validation} from 'config';
import NtroFields from 'modules/SharedComponents/Toolbox/NtroFields/components/NtroFields';
import {DOCUMENT_TYPE_BOOK, DOCUMENT_TYPE_JOURNAL_ARTICLE, DOCUMENT_TYPE_DESIGN, DOCUMENT_TYPE_RESEARCH_REPORT, CW_NTRO_SUBTYPES, LP_NTRO_SUBTYPES, RRW_NTRO_SUBTYPES, CPEE_NTRO_SUBTYPES, RESEARCH_REPORT_NTRO_SUBTYPES, NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK } from 'config/general';
import {general} from 'config';
import JSONPretty from 'react-json-pretty';

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

    isLoggedInUserLinked = (author, recordToFix, searchKey, subkey) => {
        return !!author && !!recordToFix && recordToFix[searchKey] && recordToFix[searchKey].length > 0
            && recordToFix[searchKey].filter(authorId => authorId[subkey] === author.aut_id).length > 0;
    };

    isAuthorLinked = () => {
        const isAuthorLinked = this.isLoggedInUserLinked(this.props.author, this.props.recordToFix, 'fez_record_search_key_author_id', 'rek_author_id');
        const isContributorLinked = this.isLoggedInUserLinked(this.props.author, this.props.recordToFix, 'fez_record_search_key_contributor_id', 'rek_contributor_id');

        return isAuthorLinked || isContributorLinked;
    };

    _cancelFix = () => {
        console.log('GOING BACK');
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
        const DOCUMENT_TYPE_CREATIVE_WORK = 'Creative Work';
        const DOCUMENT_TYPE_BOOK_CHAPTER = 'Book Chapter';

        const isNtro = !!this.props.recordToFix && !!this.props.recordToFix.rek_subtype && !!general.NTRO_SUBTYPES.includes(this.props.recordToFix.rek_subtype);

        // see https://docs.google.com/spreadsheets/d/1JOWQeFepCs7DWaiMY50yKacxbO_okgolJjeFc2nlMx8/edit#gid=0 for the cross reference of which fields are mandatory on which types
        const isEditableType1 = !!this.props.recordToFix && !!this.props.recordToFix.rek_display_type_lookup && !!this.props.recordToFix.rek_subtype &&
            (
                (this.props.recordToFix.rek_display_type_lookup === DOCUMENT_TYPE_DESIGN && this.props.recordToFix.rek_subtype && this.props.recordToFix.rek_subtype === NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK) ||
                (this.props.recordToFix.rek_display_type_lookup === DOCUMENT_TYPE_BOOK && !!this.props.recordToFix.rek_subtype && CW_NTRO_SUBTYPES.indexOf(this.props.recordToFix.rek_subtype) !== -1) ||
                (this.props.recordToFix.rek_display_type_lookup === DOCUMENT_TYPE_CREATIVE_WORK && !!this.props.recordToFix.rek_subtype && CW_NTRO_SUBTYPES.indexOf(this.props.recordToFix.rek_subtype) !== -1) ||
                (this.props.recordToFix.rek_display_type_lookup === DOCUMENT_TYPE_CREATIVE_WORK && !!this.props.recordToFix.rek_subtype && RRW_NTRO_SUBTYPES.indexOf(this.props.recordToFix.rek_subtype) !== -1) ||
                (this.props.recordToFix.rek_display_type_lookup === DOCUMENT_TYPE_RESEARCH_REPORT && !!this.props.recordToFix.rek_subtype && RESEARCH_REPORT_NTRO_SUBTYPES.indexOf(this.props.recordToFix.rek_subtype) !== -1)
            );

        const isEditableType2 = (!!this.props.recordToFix &&  this.props.recordToFix.rek_display_type_lookup === DOCUMENT_TYPE_CREATIVE_WORK && !!this.props.recordToFix.rek_subtype
            && (LP_NTRO_SUBTYPES.indexOf(this.props.recordToFix.rek_subtype) !== -1 || CPEE_NTRO_SUBTYPES.indexOf(this.props.recordToFix.rek_subtype) !== -1)
        );

        const isEditableType3 = !!this.props.recordToFix &&
            (this.props.recordToFix.rek_display_type_lookup === DOCUMENT_TYPE_BOOK_CHAPTER || this.props.recordToFix.rek_display_type_lookup === DOCUMENT_TYPE_JOURNAL_ARTICLE)
            && !!this.props.recordToFix.rek_subtype && CW_NTRO_SUBTYPES.indexOf(this.props.recordToFix.rek_subtype) !== -1;

        // rek_formatted_abstract
        const editAbstract = (isEditableType1 || isEditableType2 || isEditableType3) &&
            (!this.props.recordToFix || !this.props.recordToFix.rek_formatted_abstract || !this.props.recordToFix.rek_formatted_abstract);

        // fez_record_search_key_audience_size
        const editAudienceSize = isEditableType2 &&
            (!this.props.recordToFix || !this.props.recordToFix.fez_record_search_key_audience_size || !this.props.recordToFix.fez_record_search_key_audience_size.rek_audience_size);

        // fez_record_search_key_creator_contribution_statement
        const editCreatorContributionStatement = (isEditableType1 || isEditableType2 || isEditableType3) &&
            (!this.props.recordToFix || !this.props.recordToFix.fez_record_search_key_creator_contribution_statement ||
                this.props.recordToFix.fez_record_search_key_creator_contribution_statement.length === 0);

        // fez_record_search_key_language
        const editLanguage = !this.props.recordToFix || !this.props.recordToFix.fez_record_search_key_language || !this.props.recordToFix.fez_record_search_key_language || !this.props.recordToFix.fez_record_search_key_language || this.props.recordToFix.fez_record_search_key_language.length === 0;
        const defaultLanguage = !!this.props.recordToFix && !!this.props.recordToFix.fez_record_search_key_language
            && this.props.recordToFix.fez_record_search_key_language.map((lang) => {
                return lang.rek_language;
            }) || 'eng';

        // fez_record_search_key_quality_indicator
        const editQualityIndicator = (isEditableType1 || isEditableType2 || isEditableType3) &&
            (!this.props.recordToFix || !this.props.recordToFix.fez_record_search_key_quality_indicator || this.props.recordToFix.fez_record_search_key_quality_indicator.length === 0);

        // fez_record_search_key_significance
        const editSignificance = (isEditableType1 || isEditableType2 || isEditableType3) &&
            (!this.props.recordToFix || !this.props.recordToFix.fez_record_search_key_significance || this.props.recordToFix.fez_record_search_key_significance.length === 0);

        // fez_record_search_key_total_pages
        const editExtent = (isEditableType1 || isEditableType2) &&
            (!this.props.recordToFix || !this.props.recordToFix.fez_record_search_key_total_pages || !this.props.recordToFix.fez_record_search_key_total_pages.rek_total_pages);

        const editGrants = false; // TODO

        console.log('LOADING THIS PAGE');

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
        // const saveConfirmationLocale = {...txt.successWorkflowConfirmation};
        // saveConfirmationLocale.confirmationMessage = (
        //     <React.Fragment>
        //         {this.props.publicationToFixFileUploadingError && <Alert {...saveConfirmationLocale.fileFailConfirmationAlert} />}
        //         {saveConfirmationLocale.confirmationMessage}
        //     </React.Fragment>
        // );
        return (
            <StandardPage title={`${this.props.recordToFix.rek_title}`}>
                <PublicationCitation publication={this.props.recordToFix} hideTitle/>

                {
                    // remove before prod
                    !!this.props.recordToFix.rek_display_type_lookup ?
                        <p><b>Display Type</b> (for dev): {this.props.recordToFix.rek_display_type_lookup}</p>
                        : <p><b>Display Type</b> (for dev): missing</p>
                }
                {
                    // remove before prod
                    !!this.props.recordToFix.rek_subtype ?
                        <p><b>Subtype</b> (for dev) : {this.props.recordToFix.rek_subtype}</p>
                        : <p><b>Subtype</b> (for dev) : missing</p>
                }
                <Grid item xs={12}>
                    <Alert
                        title="Missing data"
                        message="This record has missing data - enter all fields to give a quality record."
                        type="info_outline"
                    />
                </Grid>

                <form onSubmit={this._handleDefaultSubmit}>
                    <Grid container spacing={24}>
                        <Grid item xs={12}>
                            {/* <StandardCard title={`Enter Required Fields for "${this.props.recordToFix.rek_title}"`}>*/}
                            {/*    <Field*/}
                            {/*        component={TextField}*/}
                            {/*        name="rek_title"*/}
                            {/*        fullWidth*/}
                            {/*        label={'Title'}*/}
                            {/*        required*/}
                            {/*        validate={[validation.required]}*/}
                            {/*    />*/}
                            {/* </StandardCard>*/}

                            {
                                isNtro &&
                                (editCreatorContributionStatement || editAbstract || editExtent || editAudienceSize || editSignificance || editQualityIndicator || editLanguage || editGrants) &&
                                <NtroFields
                                    submitting={this.props.submitting}
                                    showContributionStatement={editCreatorContributionStatement}
                                    hideIsmn
                                    hideIsrc
                                    hideVolume
                                    hideIssue
                                    hideStartPage
                                    hideEndPage
                                    hideExtent={!editExtent}
                                    hideOriginalFormat
                                    hideAbstract={!editAbstract}
                                    hideAudienceSize={!editAudienceSize}
                                    showSignificance={editSignificance}
                                    hidePeerReviewActivity={!editQualityIndicator}
                                    hideLanguage={!editLanguage}
                                    defaultLanguage={defaultLanguage}
                                    hideSeries
                                    hideGrants={!editGrants}
                                />
                            }
                        </Grid>
                        {/* <Grid item xs={12}>*/}
                        {/*    <StandardCard title={txt.fileUpload.title} help={txt.fileUpload.help}>*/}
                        {/*        <Field*/}
                        {/*            name="files"*/}
                        {/*            component={ FileUploadField }*/}
                        {/*            disabled={this.props.submitting}*/}
                        {/*            requireOpenAccessStatus*/}
                        {/*            validate={[validation.validFileUpload]}*/}
                        {/*            isNtro*/}
                        {/*        />*/}
                        {/*    </StandardCard>*/}
                        {/* </Grid>*/}
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

                {/* remove before prod */}
                <Grid item xs={12}>
                    <StandardCard title={'JSON of the initialValues'}>
                        <JSONPretty id="json-pretty" data={this.props.initialValues} />
                    </StandardCard>
                </Grid>
            </StandardPage>
        );
    }
}
