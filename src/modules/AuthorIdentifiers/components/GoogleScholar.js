import React from 'react';
import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';
import {Field} from 'redux-form/immutable';
import RaisedButton from 'material-ui/RaisedButton';
import {TextField} from 'uqlibrary-react-toolbox/build/TextField';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {StandardPage} from 'uqlibrary-react-toolbox/build/StandardPage';
import {Alert} from 'uqlibrary-react-toolbox/build/Alert';

import {locale} from 'locale';
import {routes, validation} from 'config';

export default class GoogleScholar extends React.PureComponent {
    static propTypes = {
        ...propTypes,
        author: PropTypes.object,
        accountAuthorLoading: PropTypes.bool,
        history: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    };

    componentWillMount() {
        // user should have a fez-author record to proceed
        if (!this.props.accountAuthorLoading && !this.props.author) {
            this._navigateToDashboard();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitSucceeded !== this.props.submitSucceeded) {
            // show app level alert on success
            this.props.actions.showAppAlert({
                ...locale.pages.googleScholarLink.successAlert,
                dismissAction: this.props.actions.dismissAppAlert
            });
            this._navigateToDashboard();
        }
    }

    componentWillUnmount() {
        // reset any saving state for current author on exit
        this.props.actions.resetSavingAuthorState();
    }

    _navigateToDashboard = () => {
        this.props.history.push(routes.pathConfig.dashboard);
    };

    getAlert = ({submitFailed = false, submitting = false, error, alertLocale = {}}) => {
        let alertProps = null;
        if (submitFailed && error) {
            alertProps = {
                ...alertLocale.errorAlert,
                message: alertLocale.errorAlert.message
                    ? alertLocale.errorAlert.message(error)
                    : error
            };
        } else if (submitting) {
            alertProps = {...alertLocale.progressAlert};
        }
        return alertProps ? (<Alert {...alertProps} />) : null;
    };

    render() {
        // wait for author details to be loaded
        if(!this.props.author) {
            return (<div />);
        }

        const txt = locale.pages.googleScholarLink;
        const cardLocale = !this.props.author.aut_google_scholar_id
            ? txt.add
            : txt.edit;

        return (
            <StandardPage title={txt.title}>
                <form>
                    <StandardCard title={cardLocale.title} help={txt.help}>
                        {cardLocale.description}
                        <div className="columns">
                            <div className="column">
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="aut_google_scholar_id"
                                    fullWidth
                                    {...txt.labels.googleScholarIdField}
                                    validate={[validation.required, validation.isValidGoogleScholarId]}
                                    className="requiredField" />
                            </div>
                        </div>
                    </StandardCard>

                    {
                        this.getAlert({...this.props, alertLocale: txt})
                    }

                    <div className="columns action-buttons">
                        <div className="column is-hidden-mobile"/>
                        <div className="column is-narrow-desktop">
                            <RaisedButton
                                fullWidth
                                disabled={this.props.submitting}
                                label={txt.labels.cancel}
                                onTouchTap={this._navigateToDashboard} />
                        </div>
                        <div className="column is-narrow-desktop">
                            <RaisedButton
                                secondary
                                fullWidth
                                disabled={this.props.submitting || this.props.invalid}
                                label={txt.labels.submit}
                                onTouchTap={this.props.handleSubmit} />
                        </div>
                    </div>
                </form>
            </StandardPage>
        );
    }
}
