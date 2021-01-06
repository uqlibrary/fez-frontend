import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { propTypes } from 'redux-form/immutable';
import { Field } from 'redux-form/immutable';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import locale from 'locale/pages';
import { pathConfig, validation } from 'config';

export default class GoogleScholar extends PureComponent {
    static propTypes = {
        ...propTypes,
        author: PropTypes.object,
        accountAuthorLoading: PropTypes.bool,
        history: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
    };

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillMount() {
        // user should have a fez-author record to proceed
        if (!this.props.accountAuthorLoading && !this.props.author) {
            this._navigateToDashboard();
        }
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.submitSucceeded !== this.props.submitSucceeded) {
            // show app level alert on success
            this.props.actions.showAppAlert({
                ...locale.pages.googleScholarLink.successAlert,
                dismissAction: this.props.actions.dismissAppAlert,
            });
            this._navigateToDashboard();
        }
    }

    componentWillUnmount() {
        // reset any saving state for current author on exit
        this.props.actions.resetSavingAuthorState();
    }

    _handleKeyboardFormSubmit = event => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.props.handleSubmit();
        }
    };

    _navigateToDashboard = () => {
        this.props.history.push(pathConfig.dashboard);
    };

    getAlert = ({ submitFailed = false, submitting = false, error, alertLocale = {} }) => {
        let alertProps = null;
        if (submitFailed && error) {
            alertProps = {
                ...alertLocale.errorAlert,
                message:
                    !!alertLocale.errorAlert && alertLocale.errorAlert.message
                        ? alertLocale.errorAlert.message(error)
                        : error,
            };
        } else if (submitting) {
            alertProps = { ...alertLocale.progressAlert };
        }
        return alertProps ? <Alert {...alertProps} /> : null;
    };

    render() {
        // wait for author details to be loaded
        if (!this.props.author) {
            return <div />;
        }

        const txt = locale.pages.googleScholarLink;
        const cardLocale = !this.props.author.aut_google_scholar_id ? txt.add : txt.edit;

        return (
            <StandardPage title={txt.title}>
                <form onKeyDown={this._handleKeyboardFormSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <StandardCard title={cardLocale.title} help={txt.help}>
                                {cardLocale.description}
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Field
                                            component={TextField}
                                            disabled={this.props.submitting}
                                            name="aut_google_scholar_id"
                                            fullWidth
                                            {...txt.labels.googleScholarIdField}
                                            validate={[validation.required, validation.isValidGoogleScholarId]}
                                            className="requiredField"
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>

                        {
                            <Grid item xs={12}>
                                {this.getAlert({ ...this.props, alertLocale: txt })}
                            </Grid>
                        }
                    </Grid>
                    <Grid container spacing={2}>
                        <Hidden xsDown>
                            <Grid item xs />
                        </Hidden>
                        <Grid item xs={12} sm={'auto'}>
                            <Button
                                variant={'contained'}
                                color={'primary'}
                                fullWidth
                                disabled={this.props.submitting}
                                children={txt.labels.cancel}
                                onClick={this._navigateToDashboard}
                            />
                        </Grid>
                        <Grid item xs={12} sm={'auto'}>
                            <Button
                                variant={'contained'}
                                color={'secondary'}
                                fullWidth
                                disabled={this.props.submitting || this.props.invalid}
                                children={txt.labels.submit}
                                onClick={this.props.handleSubmit}
                            />
                        </Grid>
                    </Grid>
                </form>
            </StandardPage>
        );
    }
}
