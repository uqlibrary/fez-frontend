import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';
import {Field} from 'redux-form/immutable';

import {Alert} from 'modules/SharedComponents/Toolbox/Alert';
import {NavigationDialogBox} from 'modules/SharedComponents/Toolbox/NavigationPrompt';
import {ConfirmDialogBox} from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
// import {TextField} from 'modules/SharedComponents/Toolbox/TextField';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {ListEditorField} from 'modules/SharedComponents/Toolbox/ListEditor';
import {validation} from 'config';
import locale from 'locale/components';
import {default as formLocale} from 'locale/publicationForm';
import {RichEditorField} from 'modules/SharedComponents/RichEditor';
import {CommunitiesSelectField} from 'modules/SharedComponents/PublicationSubtype';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export default class CollectionForm extends Component {
    static propTypes = {
        ...propTypes, // all redux-form props
        author: PropTypes.object,
        disableSubmit: PropTypes.bool,
        fileAccessId: PropTypes.number,
        actions: PropTypes.object,
        isSessionValid: PropTypes.bool,
        formValues: PropTypes.object,
        formErrors: PropTypes.object
    };

    static contextTypes = {
        selectFieldMobileOverrides: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.isSessionValid &&
            !nextProps.submitting
        ) {
            this.openDepositConfirmation();
        }
    }

    deposit = () => {
        this.props.actions.checkSession();
    }

    cancelSubmit = () => {
        window.location.assign(formLocale.thesisSubmission.cancelLink);
    }

    afterSubmit = () => {
        window.location.assign(formLocale.thesisSubmission.afterSubmitLink);
    }

    openDepositConfirmation = () => {
        this.depositConfirmationBox.showConfirmation();
        this.props.actions.clearSessionExpiredFlag();
    };

    setDepositConfirmation = (ref) => {
        this.depositConfirmationBox = ref;
    };

    render() {
        const txt = formLocale.collection;

        if (this.props.submitSucceeded) {
            return (
                <StandardPage title={txt.title}>
                    <Grid container spacing={24}>
                        <Grid item xs={12}>
                            <StandardCard title={formLocale.thesisSubmission.afterSubmitTitle}>
                                <Typography>{formLocale.thesisSubmission.afterSubmitText}</Typography>
                            </StandardCard>
                        </Grid>
                    </Grid>
                    <Grid container spacing={16}>
                        <Grid item xs/>
                        <Grid item>
                            <Button
                                variant={'raised'}
                                color={'primary'}
                                fullWidth
                                children={formLocale.thesisSubmission.afterSubmit}
                                onClick={this.afterSubmit}/>
                        </Grid>
                    </Grid>
                </StandardPage>
            );
        }
        // customise error for thesis submission
        const alertProps = validation.getErrorAlertProps({
            ...this.props,
            alertLocale: {
                validationAlert: {...formLocale.validationAlert},
                progressAlert: {...formLocale.progressAlert},
                successAlert: {...formLocale.successAlert},
                errorAlert: {
                    ...formLocale.errorAlert,
                    message: formLocale.thesisSubmission.depositFailedMessage
                }
            }});
        return (
            <StandardPage title={txt.title}>
                <form>
                    <NavigationDialogBox
                        when={this.props.dirty && !this.props.submitSucceeded}
                        txt={txt.cancelWorkflowConfirmation}/>

                    <ConfirmDialogBox
                        onRef={this.setDepositConfirmation}
                        onAction={this.props.handleSubmit}
                        locale={txt.depositConfirmation}
                    />
                    <Grid container spacing={24}>
                        <Grid item xs={12}>
                            <StandardCard title={txt.information.title} help={txt.information.help}>
                                <Grid container spacing={24}>
                                    <Grid item xs={12}>
                                        <Field
                                            component={CommunitiesSelectField}
                                            disabled={this.props.submitting}
                                            name="community"
                                            locale={{label: 'Member of community'}}
                                            required
                                            multiple
                                            validate={[validation.required]}
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                        {
                            this.props.formValues.get('community') &&
                            <Grid item xs={12}>
                                <StandardCard title={txt.information.title} help={txt.information.help}>
                                    <Grid container spacing={24}>
                                        <Grid item xs={12}>
                                            <Field
                                                component={RichEditorField}
                                                name="title"
                                                title={'Title'}
                                                disabled={this.props.submitting}
                                                height={50}
                                                maxLength={800}
                                                validate={[validation.required]}/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography>{txt.keywords.description}</Typography>
                                            <Field
                                                component={ListEditorField}
                                                name="fez_record_search_key_keywords"
                                                required
                                                maxCount={10}
                                                validate={[validation.requiredList]}
                                                maxInputLength={111}
                                                searchKey={{value: 'rek_keywords', order: 'rek_keywords_order'}}
                                                locale={locale.components.keywordsForm.field}
                                                disabled={this.props.submitting}/>
                                        </Grid>
                                    </Grid>
                                </StandardCard>
                            </Grid>
                        }
                        {
                            alertProps &&
                            <Grid item xs={12}>
                                <Alert {...alertProps} />
                            </Grid>
                        }
                    </Grid>
                    <Grid container spacing={16}>
                        <Grid item xs={false} sm />
                        <Grid item xs={12} sm={'auto'}>
                            <Button
                                variant={'contained'}
                                fullWidth
                                children={formLocale.thesisSubmission.cancel}
                                disabled={this.props.submitting}
                                onClick={this.cancelSubmit}/>
                        </Grid>
                        <Grid item xs={12} sm={'auto'}>
                            <Button
                                variant={'contained'}
                                color={'primary'}
                                fullWidth
                                children={formLocale.thesisSubmission.submit}
                                onClick={this.deposit}
                                disabled={this.props.submitting || this.props.disableSubmit}/>
                        </Grid>
                    </Grid>
                </form>
            </StandardPage>
        );
    }
}
